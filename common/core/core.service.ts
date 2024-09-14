import { FindByIdDto } from '@common/dto/core.dto';
import BaseSchema from './base.schema';
import ContextService from './context.service';
import Repository from './repository';
import { CreateCategoryDto } from '../dto/action.dto';

export default abstract class CoreService<T = BaseSchema> {
   protected abstract repository: Repository<T>;

   async findById({ lean, populate, id }: FindByIdDto) {
      return this.repository.findOne({ id, options: { lean, populate } });
   }

   async create({ category: $category, ...dto }: CreateType<T>, catName?: string) {
      const categoryDto: CreateCategoryDto = $category ?? dto[catName];
      const category = categoryDto
         ? await ContextService.get('d_categoryService').getCategory(categoryDto)
         : undefined;
      return this.repository.create({ ...dto, [catName ?? 'category']: category });
   }
}
