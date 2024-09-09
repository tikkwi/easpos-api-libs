import { IsBoolean, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { CoreDto, PartialTypeIf } from '@common/dto/global/core.dto';
import { Category } from '@common/schema/category.schema';

export class CategoryDto extends PartialTypeIf(({ id }) => !!id, CoreDto(Category)) {
   @ValidateIf((o) => !!!o.name)
   @IsMongoId()
   id?: string;

   @IsOptional()
   @IsBoolean()
   default?: boolean;
}
