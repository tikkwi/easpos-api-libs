import { FindByIdDto } from '@common/dto/core.dto';
import { ECategory } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { Category } from '@shared/category/category.schema';
import { IsEnum, IsNotEmpty, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Matches(regex.enum)
  name: string;

  @IsNotEmpty()
  @IsEnum(ECategory)
  type: ECategory;
}

export type CategoryReturn = { data: Category };

export interface CategoryServiceMethods {
  getCategory(dto: FindByIdDto): Promise<CategoryReturn>;
  createCategory(dto: CreateCategoryDto): Promise<CategoryReturn>;
}
