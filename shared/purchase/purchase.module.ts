import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Purchase, { PurchaseSchema } from './purchase.schema';
import PurchaseController from './purchase.controller';
import PurchaseService from './purchase.service';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
   imports: [MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }])],
   controllers: [PurchaseController],
   providers: [PurchaseService, getRepositoryProvider({ name: Purchase.name })],
})
export default class PurchaseModule {}
