import { Category } from './category.schema';
import { CategoryServiceMethods, CreateCategoryDto } from '@shared/category/category.dto';
import { FindByIdDto } from '@common/dto/core.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from '@common/core/repository';
import { REPOSITORY } from '@common/constant';

@Injectable()
export class CategoryService implements CategoryServiceMethods {
  constructor(@Inject(REPOSITORY) private readonly repository: Repository<Category>) {}

  async getCategory(dto: FindByIdDto) {
    return await this.repository.findById(dto);
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.repository.findOne({ filter: { name: dto.name, type: dto.type } });
    if (existing) throw new BadRequestException('Already exist the category');
    return await this.repository.create(dto);
  }
}
