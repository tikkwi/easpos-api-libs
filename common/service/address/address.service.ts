import { CreateAddressDto } from '@common/dto/global/address.dto';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { Repository } from '@common/core/repository';
import { FindByIdDto } from '@common/dto/global/core.dto';
import { Address } from '@common/schema/address.schema';

export abstract class AddressService extends CoreService {
   protected abstract readonly context: ContextService;
   protected abstract readonly repository: Repository<Address>;

   async getAddress({ id, lean = true }: FindByIdDto) {
      return await this.repository.findOne({ id, options: { lean } });
   }

   async createAddress(dto: CreateAddressDto) {
      return await this.repository.create(dto);
   }
}
