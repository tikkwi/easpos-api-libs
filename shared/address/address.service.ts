import BaseService from '@common/core/base/base.service';
import Address from './address.schema';
import { CreateAddressDto } from './address.dto';
import AppService from '@common/decorator/app_service.decorator';
import { ModuleRef } from '@nestjs/core';

@AppService()
export default class AddressService extends BaseService<Address> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }

   async create({ ctx: { connection, session }, ...dto }: CreateAddressDto) {
      const repository = await this.getRepository(connection, session);
      return repository.create(dto);
   }
}
