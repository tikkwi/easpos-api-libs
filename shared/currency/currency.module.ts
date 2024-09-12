import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getRepositoryProvider } from '@common/utils/misc';
import Currency, { CurrencySchema } from './currency.schema';
import CurrencyController from './currency.controller';
import CurrencyService from './currency.service';

@Module({
   imports: [MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }])],
   controllers: [CurrencyController],
   providers: [CurrencyService, getRepositoryProvider({ name: Currency.name })],
   exports: [CurrencyService],
})
export default class CurrencyModule {}
