import { CoreDto, FindByIdDto } from '@common/dto/core.dto';
import { Address } from '@shared/address/address.schema';

export class CreateAddressDto extends CoreDto(Address) {}

export type AddressReturn = { data: Address };

export interface AddressServiceMethods {
   getAddress(dto: FindByIdDto): Promise<AddressReturn>;
   createAddress(dto: CreateAddressDto): Promise<AddressReturn>;
}
