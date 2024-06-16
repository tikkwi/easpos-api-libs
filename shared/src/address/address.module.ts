import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
//import { getRepositoryProviders } from '@app/helper';
import { Address, AddressSchema } from '@app/schema';

@Module({
  controllers: [AddressController],
  providers: [
    AddressService,
    // ...getRepositoryProviders([{ name: Address.name, schema: AddressSchema }]),
  ],
})
export class AddressModule {}
