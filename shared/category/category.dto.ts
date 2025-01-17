import { CoreDto, FindByIdDto, PartialTypeIf } from '@common/dto/core.dto';
import Category from './category.schema';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { ECategory } from '@common/utils/enum';

export class CategoryFindByIdDto extends FindByIdDto {
   @IsEnum(ECategory)
   type: ECategory;
}

export class CategoryDto extends PartialTypeIf(({ id }) => !!id, CoreDto(Category)) {
   @ValidateIf((o) => !!!o.name)
   @IsMongoId()
   id?: string;

   @IsEnum(ECategory)
   type: ECategory;

   @IsOptional()
   @IsBoolean()
   default?: boolean;
}
