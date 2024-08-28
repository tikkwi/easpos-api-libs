import { CoreDto } from '@common/dto/global/core.dto';
import { Campaign } from '@common/schema/campaign.schema';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from '@common/dto/global/action.dto';

export class CreateCampaignDto extends CoreDto(Campaign) {
   @ValidateNested()
   @Type(() => CategoryDto)
   category: CategoryDto;
}
