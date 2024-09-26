import { CoreDto } from '@common/dto/core.dto';
import { IsBoolean, IsMongoId, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CategoryDto } from '@common/dto/action.dto';
import { Cash } from '@common/dto/entity.dto';
import Unit from './unit.schema';

export class ExchangeUnitDto {
   @ValidateNested({ each: true })
   @Type(() => Cash)
   current: Cash[];

   @IsOptional()
   @IsMongoId()
   targetId: string;

   @IsOptional()
   @IsBoolean()
   currency?: boolean;

   @ValidateIf((o) => !o.currency)
   @IsMongoId()
   categoryId?: string;
}

export class CreateCurrencyDto extends OmitType(CoreDto(Unit), ['category', 'currency']) {}

export class CreateUnitDto extends IntersectionType(CreateCurrencyDto, PartialType(CategoryDto)) {}
