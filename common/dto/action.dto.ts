import { IsBoolean, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { CoreDto, PartialTypeIf } from '@common/dto/core.dto';
import Category from '@shared/category/category.schema';

export class CategoryDto extends PartialTypeIf(({ id }) => !!id, CoreDto(Category)) {
   @ValidateIf((o) => !!!o.name)
   @IsMongoId()
   id?: string;

   @IsOptional()
   @IsBoolean()
   default?: boolean;
}
