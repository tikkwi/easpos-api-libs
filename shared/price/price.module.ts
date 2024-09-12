import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Price, { PriceSchema } from './price.schema';
import PriceController from './price.controller';
import PriceService from './price.service';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
   imports: [MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }])],
   controllers: [PriceController],
   providers: [PriceService, getRepositoryProvider({ name: Price.name })],
   exports: [PriceService],
})
export default class PriceModule {}
