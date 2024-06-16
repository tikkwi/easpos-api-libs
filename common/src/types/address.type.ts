import { CoreDto } from '@app/types';
import { Address } from '@app/schema';
import { Observable } from 'rxjs';

export class CreateAddressDto extends CoreDto(Address) {}

export type CreateAddressReturn = RollBack & { data: Address };

export interface AddressControllerMethods {
  createAddress(dto: Observable<CreateAddressDto>, meta: Meta): Observable<CreateAddressReturn>;
}

export interface AddressServiceMethods {
  createAddress(dto: CreateAddressDto, meta: Meta): Promise<CreateAddressReturn>;
}
