import { CoreController } from '@common/core/core.controller';
import { Body, Get, Param, Post } from '@nestjs/common';
import { UnitService } from '@common/service/unit/unit.service';
import { CreateUnitDto } from '@common/dto/service/unit.dto';

export abstract class UnitController extends CoreController {
   protected abstract service: UnitService;

   @Get(':id')
   async getCurrency(@Param('id') id: string) {
      return this.service.findById({ id });
   }

   @Get('base')
   async getBaseCurrency() {
      return this.service.getBase();
   }

   @Post('create')
   async createCurrency<C extends CreateUnitDto>(@Body() dto: C) {
      return this.service.create(dto);
   }
}
