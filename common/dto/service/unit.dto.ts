import { CoreDto } from '@common/dto/global/core.dto';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { Unit } from '@common/schema/unit.schema';
import { Type } from 'class-transformer';
import { CategoryDto } from '@common/dto/global/action.dto';
import { Cash } from '@common/dto/global/entity.dto';

export class ExchangeUnitDto {
   @ValidateNested({ each: true })
   @Type(() => Cash)
   current: Cash[];

   @IsOptional()
   @IsMongoId()
   targetId: string;
}

export class CreateUnitDto extends OmitType(CoreDto(Unit), ['category']) {
   @ValidateNested()
   @Type(() => CategoryDto)
   categoryDto: CategoryDto;
}
