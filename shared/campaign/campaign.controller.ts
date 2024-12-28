import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { Body, Post } from '@nestjs/common';
import { CreateCampaignDto } from './campaign.dto';
import ACoreController from '@common/core/core.controller';
import CampaignService from './campaign.service';

@AppController('campaign', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class CampaignController extends ACoreController {
   constructor(protected readonly service: CampaignService) {
      super();
   }

   @Post('create')
   create(@Body() dto: CreateCampaignDto) {
      return this.service.create(dto);
   }
}
