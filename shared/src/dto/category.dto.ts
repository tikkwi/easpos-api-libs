import { FindByIdDto } from '@common/dto';
import { ECategory, regex } from '@common/utils';
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
