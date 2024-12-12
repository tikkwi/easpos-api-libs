import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import ACoreService from '@common/core/core.service';
import Repository from '@common/core/repository';
import Address from './address.schema';
import { CreateAddressDto } from './address.dto';

export default class AddressService extends ACoreService<Address> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Address>) {
      super();
   }

   async create(dto: CreateAddressDto) {
      return this.repository.create(dto);
   }
}
