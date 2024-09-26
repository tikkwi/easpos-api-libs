import { EAllowance, EStatus } from '@common/utils/enum';
import { BadRequestException } from '@nestjs/common';
import { $dayjs, normalizeDate } from '@common/utils/datetime';
import { GetApplicableAllowanceDto } from './allowance.dto';
import Allowance from './allowance.schema';
import CoreService from '@common/core/core.service';
import ProductService from '../product/product.service';
import UnitService from '../unit/unit.service';
import AllowanceCodeService from '../allowance_code/allowance_code.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';

export default abstract class AllowanceService<
   T extends Allowance = Allowance,
> extends CoreService<T> {
   protected abstract productService: ProductService;
   protected abstract unitService: UnitService;
   protected abstract allowanceCodeService: AllowanceCodeService;
   protected abstract db: AppRedisService;

   async getApplicableAllowances({
      basePrice,
      perProduct,
      priceId,
      currencyId,
      paymentMethodId,
      addressId,
      products,
      coupon,
      context,
   }: GetApplicableAllowanceDto): Promise<{ data: T[] }> {
      if (perProduct && products.length > 1)
         throw new BadRequestException('Expect single purchased product for per product allowance');
      const tier = context.get('user').tier;
      const { data: product } =
         perProduct &&
         products &&
         (await this.productService.getProduct({ code: products[0].product }));
      const stockLeft = product ? product.numUnit - products[0].quantity : undefined;
      const { data: mAllowance } = coupon
         ? await this.allowanceCodeService.getAllowanceByCoupon({ code: coupon })
         : null;

      const getTargetAmount = async (id?: string, total?: boolean) => {
         const current = [basePrice];
         const prevSpend = (await this.db.get('merchant')).merchant.totalSpend;
         if (total && prevSpend) current.splice(1, 0, ...prevSpend);
         return await this.unitService.exchangeUnit({ current, targetId: id, currency: true });
      };

      const $allowances = await this.repository.custom((model) =>
         model.aggregate([
            {
               $addFields: {
                  products,
                  perProduct,
               },
            },
            {
               $match: {
                  $expr: {
                     $cond: [
                        { $eq: [mAllowance, null] },
                        { $eq: ['$autoTrigger', true] },
                        {
                           $or: [
                              { $eq: ['$autoTrigger', true] },
                              { $eq: ['$_id', mAllowance._id] },
                           ],
                        },
                     ],
                  },
                  perProduct,
                  'status.status': EStatus.Active,
               },
            },
            {
               $redact: {
                  $switch: {
                     branches: [
                        {
                           case: {
                              $and: [
                                 { $ne: ['$applicablePrices', null] },
                                 { $in: [priceId, '$applicablePrices'] },
                              ],
                              then: '$$KEEP',
                           },
                        },
                        {
                           case: {
                              $and: [
                                 { $eq: ['$type', EAllowance.PaymentMethod] },
                                 { $in: [paymentMethodId, '$paymentMethodTrigger'] },
                              ],
                           },
                           then: '$$KEEP',
                        },
                        {
                           case: {
                              $and: [
                                 { $eq: ['$type', EAllowance.Currency] },
                                 { $in: [currencyId, '$currencyTrigger'] },
                              ],
                           },
                           then: '$$KEEP',
                        },
                        {
                           case: {
                              $and: [
                                 { $eq: ['$type', EAllowance.Geographic] },
                                 { $in: [addressId, '$addressTrigger'] },
                              ],
                           },
                           then: '$$KEEP',
                        },
                        {
                           case: {
                              $and: [
                                 { $eq: ['$type', EAllowance.Bundle] },
                                 {
                                    $eq: [
                                       {
                                          $size: {
                                             $filter: {
                                                input: '$bundleTrigger',
                                                as: 'product',
                                                cond: {
                                                   $and: [
                                                      {
                                                         $in: [
                                                            '$$product.id',
                                                            {
                                                               $map: {
                                                                  input: '$products',
                                                                  as: 'pd',
                                                                  in: '$$pd.id',
                                                               },
                                                            },
                                                         ],
                                                         $gte: [
                                                            '$$product.quantity',
                                                            {
                                                               $arrayElemAt: [
                                                                  {
                                                                     $map: {
                                                                        input: '$products',
                                                                        as: 'pd',
                                                                        in: '$$pd.quantity',
                                                                     },
                                                                  },
                                                                  0,
                                                               ],
                                                            },
                                                         ],
                                                      },
                                                   ],
                                                },
                                             },
                                          },
                                       },
                                       1,
                                    ],
                                 },
                              ],
                           },
                           then: '$$KEEP',
                        },
                        {
                           case: {
                              $and: [
                                 { $eq: ['$type', EAllowance.TierBased] },
                                 { $in: [tier, '$tierTrigger'] },
                              ],
                           },
                           then: '$$KEEP',
                        },
                        {
                           case: {
                              $and: [
                                 { $eq: ['$type', EAllowance.StockLevel] },
                                 { $eq: ['$perProduct', true] },
                                 {
                                    $cond: {
                                       if: { $eq: ['$levelLowerTrigger', true] },
                                       then: { $lte: ['$levelTrigger', stockLeft] },
                                       else: { $gte: ['$levelTrigger', stockLeft] },
                                    },
                                 },
                              ],
                           },
                           then: '$$KEEP',
                        },
                        {
                           case: {
                              $and: [
                                 { $eq: ['$type', EAllowance.VolumeLevel] },
                                 { $eq: ['$perProduct', true] },
                                 { $gte: ['$levelTrigger', products[0].quantity] },
                              ],
                           },
                           then: '$$KEEP',
                        },
                        {
                           case: {
                              $in: [
                                 '$type',
                                 [
                                    EAllowance.TimeBased,
                                    EAllowance.SpendBase,
                                    EAllowance.TotalSpendBase,
                                 ],
                              ],
                           },
                           then: '$$KEEP',
                        },
                     ],
                  },
               },
            },
            {
               $facet: {
                  filtered: [
                     {
                        $match: {
                           type: {
                              $nin: [
                                 EAllowance.TimeBased,
                                 EAllowance.SpendBase,
                                 EAllowance.TotalSpendBase,
                              ],
                           },
                        },
                     },
                  ],
                  unfiltered: [
                     {
                        $match: {
                           type: {
                              $in: [
                                 EAllowance.TimeBased,
                                 EAllowance.SpendBase,
                                 EAllowance.TotalSpendBase,
                              ],
                           },
                        },
                     },
                  ],
               },
            },
         ]),
      );

      const allowances = [];
      if ($allowances.length) {
         allowances.splice(0, 0, ...allowances[0].filtered);
         for (const allowance of allowances[0].unfiltered) {
            if (allowance.type === EAllowance.TimeBased) {
               if (
                  $dayjs().isAfter(
                     normalizeDate(allowance.timeTrigger.type, allowance.timeTrigger.from),
                  ) &&
                  $dayjs().isBefore(
                     normalizeDate(allowance.timeTrigger.type, allowance.timeTrigger.to),
                  )
               )
                  allowances.push(allowance);
            } else {
               const spend = await getTargetAmount(
                  allowance.spendTrigger.currencyId,
                  allowance.type === EAllowance.TotalSpendBase,
               );
               if (spend <= allowance.spendTrigger.amount) allowances.push(allowance);
            }
         }
      }

      return { data: allowances };
   }

   abstract getPurchasedAllowance(dto: GetApplicableAllowanceDto): Promise<any>;
}
