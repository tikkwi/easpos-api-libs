import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { Body, Post } from '@nestjs/common';
import CoreController from '@common/core/core.controller';
import { CreateCurrencyDto } from './currency.dto';
import CurrencyService from './currency.service';

@AppController('currency', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Merchant] })
export default class CurrencyController extends CoreController {
   constructor(protected readonly service: CurrencyService) {
      super();
   }

   @Post('create')
   async create(@Body() dto: CreateCurrencyDto) {
      return this.service.create(dto);
   }
}
