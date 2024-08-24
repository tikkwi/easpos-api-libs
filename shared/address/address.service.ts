import { Inject } from '@nestjs/common';
import { AddressServiceMethods, CreateAddressDto } from '@shared/address/address.dto';
import { Address } from './address.schema';
import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { FindByIdDto } from '@common/dto/global/core.dto';

@AppService()
export class AddressService extends CoreService implements AddressServiceMethods {
   constructor(
      protected readonly context: ContextService,
      @Inject(REPOSITORY) private readonly repository: Repository<Address>,
   ) {
      super();
   }

   async getAddress({ id, lean = true }: FindByIdDto) {
      return await this.repository.findOne({ id, options: { lean } });
   }

   async createAddress(dto: CreateAddressDto) {
      return await this.repository.create(dto);
   }
}
