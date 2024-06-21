import { CoreService } from '@common/core/core.service';
import { Category } from './category.schema';
import { AppService } from '@common/decorator/app_service.decorator';
import { CategoryServiceMethods, CreateCategoryDto } from '@shared/dto/category.dto';
import { FindByIdDto } from '@common/dto/core.dto';

@AppService()
export class CategoryService extends CoreService<Category> implements CategoryServiceMethods {
  async getCategory(dto: FindByIdDto) {
    return await this.repository.findById(dto);
  }

  async createCategory(dto: CreateCategoryDto) {
    return await this.repository.create(dto);
  }
}
