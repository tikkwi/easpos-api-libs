import { BaseDto, FindByIdDto } from '@common/dto';
import { ECategory, regex } from '@common/utils';
import { Category } from '@shared/category/category.schema';
import { IsEnum, IsNotEmpty, Matches } from 'class-validator';

export class CreateCategoryDto extends BaseDto {
  @IsNotEmpty()
  @Matches(regex.enum)
  name: string;

  @IsNotEmpty()
  @IsEnum(ECategory)
  type: ECategory;
}

export type CategoryReturn = { data: Category };

export interface CategoryServiceMethods {
  getCategory(
    dto: FindByIdDto,
    logTrail?: RequestLog[],
  ): Promise<CategoryReturn>;
  createCategory(
    dto: CreateCategoryDto,
    logTrail?: RequestLog[],
  ): Promise<CategoryReturn>;
}
