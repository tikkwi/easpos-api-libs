import { FindByIdDto } from '@common/dto/core.dto';
import BaseSchema from './base.schema';
import Repository from './repository';
import { CreateCategoryDto } from '../dto/action.dto';

export default abstract class CoreService<T = BaseSchema> {
   protected abstract repository: Repository<T>;

   async findById({ lean, populate, id, errorOnNotFound }: FindByIdDto) {
      return this.repository.findOne({ id, options: { lean, populate, errorOnNotFound } });
   }

   async create({ category: $category, context, ...dto }: CreateType<T>, catName?: string) {
      const categoryDto: CreateCategoryDto = $category ?? dto[catName];

      const category = categoryDto
         ? await context.get('categoryService').getCategory(categoryDto)
         : undefined;
      return this.repository.create({ ...dto, [catName ?? 'category']: category });
   }
}
