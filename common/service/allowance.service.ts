import { CoreService } from '@common/core/service/core.service';
import { Allowance } from '@common/schema/allowance.schema';
import { EAllowance, EStatus, ETime } from '@common/utils/enum';
import { GetApplicableAllowanceDto } from '@common/dto/service/allowance.dto';
import { $dayjs, normalizeDate } from '@common/utils/datetime';
import { BadRequestException } from '@nestjs/common';

export abstract class AllowanceService<T extends Allowance = Allowance> extends CoreService<T> {
   protected abstract readonly productService: any; //ProductService | ProductUnitService

   async getApplicableAllowances({
      basePrice,
      perProduct,
      priceId,
      currencyId,
      paymentMethodId,
      addressId,
      products,
   }: GetApplicableAllowanceDto) {
      const totalSpend = basePrice + (this.context.get('merchant')?.merchant.totalSpend ?? 0);
      if (perProduct && products.length > 1)
         throw new BadRequestException('Expect single purchased product for per product allowance');
      const tier = this.context.get('user').tier;
      const { data: product } =
         perProduct &&
         products &&
         (await this.productService.getProduct({ code: products[0].product }));
      const stockLeft = product ? product.numUnit - products[0].quantity : undefined;

      const allowances: Allowance[] = await this.repository.custom((model) =>
         model.aggregate([
            {
               $match: {
                  autoTrigger: true,
                  perProduct,
                  'status.status': EStatus.Active,
                  $where: function () {
                     if (
                        this.applicablePrices &&
                        (!priceId ||
                           !this.applicablePrices.some((oId: ObjectId) => oId.equals(priceId)))
                     )
                        return false;
                     switch (this.type) {
                        case EAllowance.PaymentMethod:
                           return this.paymentMethodTrigger.some((oId: ObjectId) =>
                              oId.equals(paymentMethodId),
                           );
                        case EAllowance.Currency:
                           return this.currencyTrigger.some((oId: ObjectId) =>
                              oId.equals(currencyId),
                           );
                        case EAllowance.Geographic:
                           return (
                              addressId &&
                              this.addressTrigger?.some((oId: ObjectId) => oId.equals(addressId))
                           );
                        case EAllowance.Bundle:
                           const bundle = [...products];

                           for (const bdl of this.bundleTrigger) {
                              for (let i = 0; i < bundle.length; i++) {
                                 if (
                                    bundle.some(
                                       ({ quantity, product }) =>
                                          product === bdl.product && quantity >= bdl.quantity,
                                    )
                                 ) {
                                    bundle.splice(i, 1);
                                 } else return false;
                              }
                           }
                           return true;
                        case EAllowance.TimeBased:
                           const unit =
                              this.timeTrigger.type === ETime.Month
                                 ? 'm'
                                 : this.timeTrigger.type === ETime.Day
                                   ? 'd'
                                   : 'h';
                           return (
                              $dayjs().isAfter(normalizeDate(unit, this.timeTrigger.from)) &&
                              $dayjs().isBefore(normalizeDate(unit, this.timeTrigger.to))
                           );
                        case EAllowance.TierBased:
                           return (
                              tier && this.tierTrigger?.some((oId: ObjectId) => oId.equals(tier))
                           );
                        case EAllowance.StockLevel:
                           return perProduct && stockLeft >= 0 && this.levelLowerTrigger
                              ? stockLeft <= this.levelTrigger
                              : stockLeft >= this.levelTrigger;
                        case EAllowance.VolumeLevel:
                           return perProduct && products[0].quantity >= this.levelTrigger;
                        case EAllowance.SpendBase:
                           return basePrice >= this.spendTrigger;
                        case EAllowance.TotalSpendBase:
                           return (totalSpend ?? 0) + basePrice >= this.spendTrigger;
                     }
                  },
               },
            },
            {
               $group: {
                  _id: null,
                  minAmount: { $min: '$spendTrigger' },
                  doc: { $first: '$$ROOT' },
               },
            },
            {
               $match: {
                  $expr: {
                     $or: [
                        {
                           $and: [
                              { $eq: ['$type', EAllowance.SpendBase] },
                              { $eq: ['$doc.amount', '$minAmount'] },
                           ],
                        },
                        {
                           $and: [
                              { $eq: ['$type', EAllowance.TotalSpendBase] },
                              { $eq: ['$doc.amount', '$minAmount'] },
                           ],
                        },
                        {
                           $not: {
                              $in: ['$type', [EAllowance.SpendBase, EAllowance.TotalSpendBase]],
                           },
                        },
                     ],
                  },
               },
            },
            { $replaceRoot: { newRoot: '$doc' } },
         ]),
      );

      return { data: allowances };
   }
}
