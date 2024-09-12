import { CategoryDto } from '@common/dto/action.dto';
import { CoreDto } from '@common/dto/core.dto';
import Campaign from './campaign.schema';
import { IntersectionType } from '@nestjs/swagger';

export class CreateCampaignDto extends IntersectionType(CoreDto(Campaign), CategoryDto) {}
