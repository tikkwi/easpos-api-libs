import { Body, Get, Param, Post, Req } from '@nestjs/common';
import UnitService from './unit.service';
import { CreateUnitDto } from './unit.dto';
import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { Request } from 'express';

@AppController('unit', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class UnitController {
   constructor(protected readonly service: UnitService) {}

   @Get(':id')
   async getCurrency(@Param('id') id: string, @Req() { ctx }: Request) {
      return this.service.findById({ ctx, id });
   }

   @Post('create')
   async createUnit(@Body() dto: Omit<CreateUnitDto, 'isCurrency'>, @Req() { ctx }: Request) {
      return this.service.createUnit({ isCurrency: false, ctx, ...dto });
   }

   @Post('create-currency')
   async createCurrency(@Body() dto: Omit<CreateUnitDto, 'isCurrency'>, @Req() { ctx }: Request) {
      return this.service.createUnit({ isCurrency: false, ctx, ...dto });
   }
}
