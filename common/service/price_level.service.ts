import { CoreService } from '@common/core/service/core.service';
import { PriceLevel } from '@common/schema/price_level.schema';
import { GetApplicablePriceDto } from '@common/dto/service/price_level.dto';
import { PriceService } from '@common/service/price.service';
import { EPrice, EStatus } from '@common/utils/enum';

export abstract class PriceLevelService<T extends PriceLevel = PriceLevel> extends CoreService<T> {
   protected abstract priceService: PriceService;

   async getPrice<T extends GetApplicablePriceDto>(
      { id, amount, currencyId, paymentMethodId }: T,
      getBasePrice?: (p: any) => number,
      totalSpend?: number,
   ) {
      let basePrice = amount;
      const { data: price } = id
         ? await this.priceService.findById({ id, errorOnNotFound: true })
         : { data: undefined };
      if (price) {
         basePrice = price.basePrice;
         if (getBasePrice) basePrice = getBasePrice(price);
      }

      const priceLevels: PriceLevel[] = await this.repository.custom((model) =>
         model.aggregate([
            {
               $match: {
                  ...(id ? { applicablePrices: { $in: [id] } } : {}),
                  $or: [
                     { spendTriggerAmount: { $exists: false } },
                     {
                        $expr: {
                           $gte: [
                              {
                                 $cond: {
                                    if: { $eq: ['$type', EPrice.TotalSpendBase] },
                                    then: (totalSpend ?? 0) + basePrice,
                                    else: basePrice,
                                 },
                              },
                              '$spendTriggerAmount',
                           ],
                        },
                     },
                  ],
                  'status.status': EStatus.Active,
               },
            },
            {
               $group: {
                  _id: null,
                  minAmount: { $min: '$spendTriggerAmount' },
                  doc: { $first: '$$ROOT' },
               },
            },
            { $match: { 'doc.amount': { $eq: '$minAmount' } } },
            { $replaceRoot: { newRoot: '$doc' } },
         ]),
      );

      if (priceLevels.length) {
         let allowance = 0;
         let nonStkAllowance = 0;
         for (const lvl of priceLevels) {
            if (
               (lvl.type === EPrice.PaymentMethod &&
                  !(lvl.paymentMethod as any).equals(paymentMethodId)) ||
               (lvl.type === EPrice.Currency && !(lvl.currency as any).equals(currencyId))
            )
               continue;
            const allAmt = lvl.percentage ? (basePrice * lvl.amount) / 100 : lvl.amount;
            if (lvl.stackable) allowance += allAmt;
            else nonStkAllowance = Math.max(allAmt, nonStkAllowance);
         }

         return { data: basePrice - (allowance + nonStkAllowance) };
      } else return { data: basePrice };
   }
}
