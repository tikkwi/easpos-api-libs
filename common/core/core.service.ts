import { FindByIdDto, FindByIdsDto } from '@common/dto/core.dto';
import BaseSchema from './base.schema';
import Repository from './repository';
import { NotFoundException } from '@nestjs/common';

export default abstract class ACoreService<T = BaseSchema> {
   protected abstract repository: Repository<T>;

   async findById({ id, errorOnNotFound = true, ...options }: Omit<FindByIdDto, 'context'>) {
      return this.repository.findOne({
         id,
         options: { errorOnNotFound, ...options },
      });
   }

   async findByIds({ ids, errorOnNotFound = true, ...options }: Omit<FindByIdsDto, 'context'>) {
      const { data } = await this.repository.find({
         filter: { _id: { $in: ids } },
         options,
      });
      if (errorOnNotFound && data.length !== ids.length) throw new NotFoundException();
      return { data };
   }
}
