import { CoreService } from '@common/core/core.service';
import { Address } from './address.schema';
import { AppService } from '@common/decorator/app_service.decorator';
import { AddressServiceMethods, CreateAddressDto } from '@shared/dto/address.dto';
import { FindByIdDto } from '@common/dto/core.dto';

@AppService()
export class AddressService extends CoreService<Address> implements AddressServiceMethods {
  async getAddress({ id, lean = true }: FindByIdDto) {
    return await this.repository.findById({ id, options: { lean } });
  }

  async createAddress(dto: CreateAddressDto) {
    return await this.repository.create(dto);
  }
}
