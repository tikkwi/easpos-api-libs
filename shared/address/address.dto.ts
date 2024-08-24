import { Address } from '@shared/address/address.schema';
import { CoreDto, FindByIdDto } from '@common/dto/global/core.dto';

export class CreateAddressDto extends CoreDto(Address) {}

export type AddressReturn = { data: Address };

export interface AddressServiceMethods {
   getAddress(dto: FindByIdDto): Promise<AddressReturn>;

   createAddress(dto: CreateAddressDto): Promise<AddressReturn>;
}
