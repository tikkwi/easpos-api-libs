import { CoreDto } from '@common/dto/global/core.dto';
import { Address } from '@common/schema/address.schema';

export class CreateAddressDto extends CoreDto(Address) {}
