import { ECategory, regex } from '@app/helper';
import { Category } from '@app/schema';
import { FindByIdDto } from '@app/types';
import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { Observable } from 'rxjs';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Matches(regex.enum)
  name: string;

  @IsNotEmpty()
  @IsEnum(ECategory)
  type: ECategory;
}

export type CategoryReturn = { data: Category };
export type CreateCategoryReturn = CategoryReturn & RollBack;

export interface CategoryControllerMethods {
  getCategory(dto: FindByIdDto, meta: Meta): Promise<CategoryReturn>;
  createCategory(dto: Observable<CreateCategoryDto>, meta: Meta): Observable<CreateCategoryReturn>;
}

export interface CategoryServiceMethods extends Omit<CategoryControllerMethods, 'createCategory'> {
  createCategory(dto: CreateCategoryDto, meta: Meta): Promise<CreateCategoryReturn>;
}
