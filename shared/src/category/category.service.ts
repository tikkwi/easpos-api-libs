import { REPOSITORY } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { CoreService } from '@common/core/core.service';
import { Repository } from '@common/core/repository';
import { AppService } from '@common/decorator/app_service.decorator';
import { FindByIdDto } from '@common/dto/core.dto';
import { BadRequestException, Inject } from '@nestjs/common';
import { CategoryServiceMethods, CreateCategoryDto } from '@shared/category/category.dto';
import { Category } from './category.schema';

@AppService()
export class CategoryService extends CoreService implements CategoryServiceMethods {
  constructor(
    @Inject(REPOSITORY) private readonly repository: Repository<Category>,
    protected readonly context: ContextService,
  ) {
    super();
  }

  async getCategory(dto: FindByIdDto) {
    return await this.repository.findById(dto);
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.repository.findOne({ filter: { name: dto.name, type: dto.type } });
    if (existing) throw new BadRequestException('Already exist the category');
    return await this.repository.create(dto);
  }
}
