import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { Body, Post } from '@nestjs/common';
import { CreateCampaignDto } from './campaign.dto';
import CampaignService from './campaign.service';

@AppController('campaign', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class CampaignController {
   constructor(protected readonly service: CampaignService) {}

   @Post('create')
   create(@Body() dto: CreateCampaignDto) {
      return this.service.create(dto);
   }
}
