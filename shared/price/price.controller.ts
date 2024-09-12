import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import CoreController from '@common/core/core.controller';
import PriceService from './price.service';
import { Body, Post } from '@nestjs/common';
import { CreatePriceDto } from './price.dto';

@AppController('price', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Merchant] })
export default class PriceController extends CoreController {
   constructor(protected readonly service: PriceService) {
      super();
   }

   @Post('create')
   async create(@Body() dto: CreatePriceDto) {
      return this.service.createPrice(dto);
   }
}
