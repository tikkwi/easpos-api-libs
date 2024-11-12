import { Body, Post } from '@nestjs/common';
import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { CreateAddressDto } from './address.dto';
import ACoreController from '@common/core/core.controller';
import AddressService from './address.service';

@AppController('address', { default: [EAllowedUser.Any] })
export default class AddressController extends ACoreController {
   constructor(protected readonly service: AddressService) {
      super();
   }

   @Post('create')
   async createAddress(@Body() dto: CreateAddressDto) {
      return this.service.create(dto);
   }
}
