import { Module } from '@nestjs/common';
import { CampaignSchema } from './campaign.schema';
import CampaignController from './campaign.controller';
import CampaignService from './campaign.service';
import { SCHEMA } from '@common/constant';

@Module({
   controllers: [CampaignController],
   providers: [CampaignService, { provide: SCHEMA, useValue: CampaignSchema }],
   exports: [CampaignService],
})
export default class CampaignModule {}
