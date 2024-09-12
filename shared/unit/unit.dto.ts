import { CoreDto } from '@common/dto/core.dto';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { IntersectionType, OmitType } from '@nestjs/swagger';
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
}

export class CreateUnitDto extends IntersectionType(
   OmitType(CoreDto(Unit), ['category']),
   CategoryDto,
) {}
