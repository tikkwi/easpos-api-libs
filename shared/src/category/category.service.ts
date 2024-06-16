import { CoreService } from '@app/core/core.service';
import { AppService } from '@app/decorator';
import { EApp } from '@app/helper';
import { Category, CategorySchema } from '@app/schema';
import {
  CategoryDto,
  CategoryReturn,
  CategoryServiceMethods,
  CreateCategoryDto,
  FindByIdDto,
} from '@app/types';

@AppService()
export class CategoryService extends CoreService<Category> implements CategoryServiceMethods {
  constructor() {
    super(EApp.Shared, Category.name, CategorySchema);
  }

  async getCategory(dto: FindByIdDto, _): Promise<CategoryReturn> {
    return await this.repository.findById(dto);
  }

  async createCategory(dto: CreateCategoryDto, _) {
    return await this.repository.create(dto);
  }
}
