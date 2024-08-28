import { ContextService } from '../context/context.service';
import { Repository } from '@common/core/repository';
import { FindByIdDto } from '@common/dto/global/core.dto';

export abstract class CoreService<T> {
   protected abstract repository: Repository<T>;
   protected abstract readonly context: ContextService;

   async findById(dto: FindByIdDto) {
      return this.repository.findOne(dto);
   }

   async create(dto: any) {
      return this.repository.create(dto);
   }
}
