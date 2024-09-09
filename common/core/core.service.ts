import { Repository } from '@common/core/repository';
import { FindByIdDto } from '@common/dto/global/core.dto';
import { BaseSchema } from '@common/schema/base.schema';

export abstract class CoreService<T extends BaseSchema = BaseSchema> {
   protected abstract repository: Repository<T>;

   async findById({ lean, ...dto }: FindByIdDto) {
      return this.repository.findOne({ ...dto, options: { lean } });
   }

   async create(dto?: any, tf?: () => Promise<CreateType<T>>) {
      return this.repository.create(tf ? tf() : dto);
   }
}
