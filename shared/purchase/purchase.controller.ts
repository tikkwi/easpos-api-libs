import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import CoreController from '@common/core/core.controller';
import PurchaseService from './purchase.service';
import { Body, Post } from '@nestjs/common';
import { CreatePurchaseDto } from './purchase.dto';

@AppController('purchase', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Merchant] })
export default class PurchaseController extends CoreController {
   constructor(protected readonly service: PurchaseService) {
      super();
   }

   @Post('create')
   async create(@Body() dto: CreatePurchaseDto) {
      return this.service.createPurchase(dto);
   }
}
