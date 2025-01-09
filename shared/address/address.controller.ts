import { Body, Post, Req } from '@nestjs/common';
import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { CreateAddressDto } from './address.dto';
import AddressService from './address.service';
import { Request } from 'express';

@AppController('address', { default: [EAllowedUser.Any] })
export default class AddressController {
   constructor(protected readonly service: AddressService) {}

   @Post('create')
   async createAddress(@Req() { ctx }: Request, @Body() dto: CreateAddressDto) {
      return this.service.create(ctx, dto);
   }
}
