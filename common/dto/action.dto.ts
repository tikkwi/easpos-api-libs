import { IsBoolean, IsMongoId, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { CoreDto, PartialTypeIf } from '@common/dto/core.dto';
import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import Category from '@shared/category/category.schema';

export class CreateCategoryDto extends PartialTypeIf(({ id }) => !!id, CoreDto(Category)) {
   @ValidateIf((o) => !!!o.name)
   @IsMongoId()
   id?: string;

   @IsOptional()
   @IsBoolean()
   default?: boolean;
}

export class CategoryDto {
   @ValidateNested()
   @Type(() => OmitType(CreateCategoryDto, ['type']))
   category: Omit<CreateCategoryDto, 'type'>;
}
