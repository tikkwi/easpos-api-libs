import { CoreController } from '@common/core/core.controller';
import { Body, Post } from '@nestjs/common';
import { CreateAddressDto } from '@common/dto/global/address.dto';

export abstract class AddressController extends CoreController {
   @Post('create')
   async createAddress(@Body() dto: CreateAddressDto) {
      return this.service.create(dto);
   }
}
