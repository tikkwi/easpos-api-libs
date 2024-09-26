import { Body, Get, Param, Post } from '@nestjs/common';
import CoreController from '@common/core/core.controller';
import UnitService from './unit.service';
import { CreateCurrencyDto, CreateUnitDto } from './unit.dto';
import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';

@AppController('unit', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Merchant] })
export default class UnitController extends CoreController {
   constructor(protected readonly service: UnitService) {
      super();
   }

   @Get(':id')
   async getCurrency(@Param('id') id: string) {
      return this.service.findById({ id });
   }

   @Get('base')
   async getBaseCurrency() {
      return this.service.getBase();
   }

   @Post('create')
   async createUnit(@Body() dto: CreateUnitDto) {
      return this.service.createUnit(dto);
   }

   @Post('create-currency')
   async createCurrency(@Body() dto: CreateCurrencyDto) {
      return this.service.createUnit(dto, true);
   }
}
