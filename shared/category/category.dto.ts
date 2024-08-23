import { FindByIdDto } from '@global_dto/core.dto';
import { ECategory } from '@utils/enum';
import { regex } from '@utils/regex';
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
