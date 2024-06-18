import { CoreDto, FindByIdDto } from '@common/dto';
import { Address } from '@shared/address/address.schema';

export class CreateAddressDto extends CoreDto(Address) {}

export type AddressReturn = { data: Address };

export interface AddressServiceMethods {
  getAddress(dto: FindByIdDto, logTrail?: RequestLog[]): Promise<AddressReturn>;
  createAddress(
    dto: CreateAddressDto,
    logTrail?: RequestLog[],
  ): Promise<AddressReturn>;
}
