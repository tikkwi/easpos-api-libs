import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator';
import { FindByIdDto } from '@common/dto';
import { AddressServiceMethods, CreateAddressDto } from '@shared/dto';
import { Address, AddressSchema } from './address.schema';

@AppService()
export class AddressService
  extends CoreService<Address>
  implements AddressServiceMethods
{
  constructor() {
    super(Address.name, AddressSchema);
  }

  async getAddress({ id, lean = true }: FindByIdDto) {
    return await this.repository.findById({ id, options: { lean } });
  }

  async createAddress(dto: CreateAddressDto) {
    return await this.repository.create(dto);
  }
}
