import { CoreDto } from '@common/dto/global/core.dto';
import { Currency } from '@common/schema/currency.schema';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ExchangeCurrencyDto {
   @IsNotEmpty()
   @IsNumber()
   amount: number;

   @IsMongoId()
   currency: string;

   @IsOptional()
   @IsMongoId()
   target: string;
}

export class CreateCurrencyDto extends CoreDto(Currency) {}
