import { Module } from '@nestjs/common';
import { AddressSchema } from './address.schema';
import AddressService from './address.service';
import AddressController from './address.controller';
import { SCHEMA } from '@common/constant';

@Module({
   providers: [AddressService, { provide: SCHEMA, useValue: AddressSchema }],
   controllers: [AddressController],
   exports: [AddressService],
})
export default class AddressModule {}
