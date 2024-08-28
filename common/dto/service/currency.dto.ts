import { CoreDto } from '@common/dto/global/core.dto';
import { Currency } from '@common/schema/currency.schema';

export class CreateCurrencyDto extends CoreDto(Currency) {}
