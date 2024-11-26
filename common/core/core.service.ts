import { FindByIdDto, FindByIdsDto } from '@common/dto/core.dto';
import BaseSchema from './base.schema';
import Repository from './repository';
import { CategoryDto } from '../dto/action.dto';
import { NotFoundException } from '@nestjs/common';

export default abstract class ACoreService<T = BaseSchema> {
   protected abstract repository: Repository<T>;

   async findById({ lean, populate, id, errorOnNotFound = true, projection }: FindByIdDto) {
      return this.repository.findOne({
         id,
         options: { lean, populate, errorOnNotFound, projection },
      });
   }

   async findByIds({ lean, populate, ids, errorOnNotFound = true, projection }: FindByIdsDto) {
      const { data } = await this.repository.find({
         filter: { _id: { $in: ids } },
         options: { lean, populate, projection },
      });
      if (errorOnNotFound && data.length !== ids.length) throw new NotFoundException();
      return { data };
   }

   async create({ category: $category, context, ...dto }: CreateType<T>, catName?: string) {
      const categoryDto: CategoryDto = $category ?? dto[catName];

      const category = categoryDto
         ? await context.get('categoryService').getCategory(categoryDto)
         : undefined;
      return this.repository.create({ ...dto, [catName ?? 'category']: category });
   }
}
