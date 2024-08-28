import { CoreController } from '@common/core/core.controller';
import { Body, Get, Param, Post } from '@nestjs/common';
import { CurrencyService } from '@common/service/currency/currency.service';
import { CreateCurrencyDto } from '@common/dto/service/currency.dto';

export abstract class CurrencyController extends CoreController {
   protected abstract service: CurrencyService;

   @Get(':id')
   async getCurrency(@Param('id') id: string) {
      return this.service.findById({ id });
   }

   @Get('base')
   async getBaseCurrency() {
      return this.service.getBaseCurrency();
   }

   @Post('create')
   async createCurrency(@Body() dto: CreateCurrencyDto) {
      return this.service.create(dto);
   }
}
