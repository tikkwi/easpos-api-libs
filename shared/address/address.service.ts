import BaseService from '@common/core/base/base.service';
import Address from './address.schema';
import { CreateAddressDto } from './address.dto';
import AppService from '@common/decorator/app_service.decorator';

@AppService()
export default class AddressService extends BaseService<Address> {
   async create(dto: CreateAddressDto) {
      const repository = await this.getRepository();
      return repository.create(dto);
   }
}
