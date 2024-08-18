import { REPOSITORY } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { CoreService } from '@common/core/service/core.service';
import { Repository } from '@common/core/repository';
import { AppService } from '@common/decorator/app_service.decorator';
import { FindByIdDto } from '@common/dto/core.dto';
import { Inject } from '@nestjs/common';
import { AddressServiceMethods, CreateAddressDto } from '@shared/address/address.dto';
import { Address } from './address.schema';

@AppService()
export class AddressService extends CoreService implements AddressServiceMethods {
   constructor(
      protected readonly context: ContextService,
      @Inject(REPOSITORY) private readonly repository: Repository<Address>,
   ) {
      super();
   }

   async getAddress({ id, lean = true }: FindByIdDto) {
      return await this.repository.findById({ id, options: { lean } });
   }

   async createAddress(dto: CreateAddressDto) {
      return await this.repository.create(dto);
   }
}
