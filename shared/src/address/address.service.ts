import { Repository } from '@app/core';
import { CoreService } from '@app/core/core.service';
import { AppService } from '@app/decorator';
import { EApp } from '@app/helper';
import { Address, AddressSchema } from '@app/schema';
import { AddressServiceMethods, CreateAddressDto, FindByIdDto } from '@app/types';

@AppService()
export class AddressService extends CoreService<Address> implements AddressServiceMethods {
  constructor() {
    super(EApp.Shared, Address.name, AddressSchema);
  }

  async getAddress({ id, lean = true }: FindByIdDto, _) {
    return await this.repository.findById({ id, options: { lean } });
  }

  async createAddress(dto: CreateAddressDto, _) {
    return await this.repository.create(dto);
  }
}
