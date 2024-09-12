import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import CoreService from '@common/core/core.service';
import Repository from '@common/core/repository';
import Address from './address.schema';

export default class AddressService extends CoreService<Address> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Address>) {
      super();
   }
}
