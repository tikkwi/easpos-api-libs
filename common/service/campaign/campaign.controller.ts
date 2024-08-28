import { CoreController } from '@common/core/core.controller';
import { Body, Post } from '@nestjs/common';
import { CreateCampaignDto } from '@common/dto/service/campaign.dto';

export abstract class CampaignController extends CoreController {
   @Post('create')
   async createCampaign(@Body() dto: CreateCampaignDto) {
      return this.service.create(dto);
   }
}
