import { Currency } from '@common/schema/currency.schema';
import { CoreService } from '@common/core/service/core.service';
import { CreateCurrencyDto, ExchangeCurrencyDto } from '@common/dto/service/currency.dto';
import { BadRequestException } from '@nestjs/common';

export abstract class CurrencyService extends CoreService<Currency> {
   async getBaseCurrency() {
      return await this.repository.findOne({ filter: { baseCurrency: true } });
   }

   async create(dto: CreateCurrencyDto) {
      if (dto.baseCurrency) {
         const baseCurrency = await this.getBaseCurrency();
         if (baseCurrency) throw new BadRequestException('There is already a base currency');
      }
      return super.create(dto);
   }

   async exchangeCurrency({ amount, currency, target }: ExchangeCurrencyDto) {
      let $currency: number;
      ({
         data: { basePrice: $currency },
      } = await this.findById({
         id: currency,
         errorOnNotFound: true,
      }));

      if (target) {
         const {
            data: { basePrice: tarBase },
         } = await this.findById({ id: target, errorOnNotFound: true });
         $currency = tarBase / $currency;
      }
      return { data: amount * $currency };
   }
}
