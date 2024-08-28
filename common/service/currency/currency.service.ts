import { Currency } from '@common/schema/currency.schema';
import { CoreService } from '@common/core/service/core.service';
import { CreateCurrencyDto } from '@common/dto/service/currency.dto';
import { BadRequestException } from '@nestjs/common';

export abstract class CurrencyService extends CoreService<Currency> {
   abstract getBaseCurrency(): Promise<{ data: Currency }>;

   async create(dto: CreateCurrencyDto) {
      if (dto.baseCurrency) {
         const baseCurrency = await this.getBaseCurrency();
         if (baseCurrency) throw new BadRequestException('There is already a base currency');
      }
      return super.create(dto);
   }
}
