import { CoreDto, FindByIdDto } from '@common/dto/core.dto';
import Category from './category.schema';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ECategory } from '@common/utils/enum';
import { PartialType } from '@nestjs/swagger';

export class CategoryFindByIdDto extends FindByIdDto {
   @IsEnum(ECategory)
   type: ECategory;
}

export class CreateCategoryDto extends CoreDto(Category) {}

export class CategoryDto extends PartialType(CoreDto(Category)) {
   @IsEnum(ECategory)
   type: ECategory;

   @IsOptional()
   @IsBoolean()
   default?: boolean;
}
