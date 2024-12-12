import { CoreDto, FindByIdDto, FindByIdsDto, PartialTypeIf } from '@common/dto/core.dto';
import Category from './category.schema';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { ECategory } from '@common/utils/enum';
import { IntersectionType, OmitType } from '@nestjs/swagger';

class FindCategoryDto {
   @IsEnum(ECategory)
   type?: ECategory;
}

export class CreateCategoryDto extends CoreDto(Category) {}

export class CategoryFindByIdDto extends IntersectionType(
   FindCategoryDto,
   OmitType(FindByIdDto, ['context']),
) {}

export class CategoryFindByIdsDto extends IntersectionType(
   FindCategoryDto,
   OmitType(FindByIdsDto, ['context']),
) {}

export class CategoryDto extends PartialTypeIf(({ id }) => !!id, CoreDto(Category)) {
   @ValidateIf((o) => !!!o.name)
   @IsMongoId()
   id?: string;

   @IsEnum(ECategory)
   type?: ECategory;

   @IsOptional()
   @IsBoolean()
   default?: boolean;
}
