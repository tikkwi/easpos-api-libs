import { CoreDto } from '@common/dto/core.dto';
import { IsMongoId, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';
import Unit from './unit.schema';
import { CategoryDto } from '../category/category.dto';

export class GetBaseUnitDto {
   @ValidateIf((o) => !o.categoryId)
   @IsMongoId()
   unitId?: string;

   @ValidateIf((o) => !o.unitId)
   @IsMongoId()
   categoryId?: string;
}

export class ExchangeUnitDto {
   @ValidateNested({ each: true })
   @Type(() => Amount)
   current: Amount[];

   @IsOptional()
   @IsMongoId()
   targetId?: string;
}

export class CreateCurrencyDto extends OmitType(CoreDto(Unit), ['category']) {}

export class CreateUnitDto extends IntersectionType(CreateCurrencyDto, PartialType(CategoryDto)) {}
