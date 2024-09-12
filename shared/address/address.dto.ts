import { CoreDto } from '@common/dto/core.dto';
import Address from './address.schema';

export class CreateAddressDto extends CoreDto(Address) {}
