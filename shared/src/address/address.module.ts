import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressController } from './address.controller';
import { Address, AddressSchema } from './address.schema';
import { AddressService } from './address.service';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
  imports: [MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }])],
  controllers: [AddressController],
  providers: [AddressService, getRepositoryProvider({ name: Address.name })],
  exports: [AddressService],
})
export class AddressModule {}
