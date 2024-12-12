import { CoreDto } from '@common/dto/core.dto';
import Campaign from './campaign.schema';
import { OmitType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CategoryDto } from '../category/category.dto';

export class CreateCampaignDto extends OmitType(CoreDto(Campaign), ['type']) {
   @IsOptional()
   @ValidateNested()
   @Type(() => CategoryDto)
   category?: CategoryDto;
}
