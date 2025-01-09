import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { Body, Post, Req } from '@nestjs/common';
import { CreateCampaignDto } from './campaign.dto';
import CampaignService from './campaign.service';
import { Request } from 'express';

@AppController('campaign', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class CampaignController {
   constructor(protected readonly service: CampaignService) {}

   @Post('create')
   create(@Req() { ctx }: Request, @Body() dto: CreateCampaignDto) {
      return this.service.create(ctx, dto);
   }
}
