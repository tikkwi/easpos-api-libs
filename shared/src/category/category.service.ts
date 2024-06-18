import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator';
import { FindByIdDto } from '@common/dto';
import { CategoryServiceMethods, CreateCategoryDto } from '@shared/dto';
import { Category, CategorySchema } from './category.schema';

@AppService()
export class CategoryService extends CoreService<Category> implements CategoryServiceMethods {
  constructor() {
    super(Category.name, CategorySchema);
  }

  async getCategory(dto: FindByIdDto) {
    return await this.repository.findById(dto);
  }

  async createCategory(dto: CreateCategoryDto) {
    return await this.repository.create(dto);
  }
}
