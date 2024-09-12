import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getRepositoryProvider } from '@common/utils/misc';
import Address, { AddressSchema } from './address.schema';
import AddressService from './address.service';
import AddressController from './address.controller';

@Module({
   imports: [MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }])],
   providers: [AddressService, getRepositoryProvider({ name: Address.name })],
   controllers: [AddressController],
})
export default class AddressModule {}
