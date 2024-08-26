import { Category } from '@common/schema/global/category.schema';
import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { regex } from '@common/utils/regex';
import { ECategory } from '@common/utils/enum';
import { FindByIdDto } from '@common/dto/global/core.dto';

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
