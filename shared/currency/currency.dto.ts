import { CoreDto } from '@common/dto/core.dto';
import Currency from './currency.schema';

export class CreateCurrencyDto extends CoreDto(Currency) {}
