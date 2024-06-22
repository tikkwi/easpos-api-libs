import { Body, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AddressService } from './address.service';
import { CreateAddressDto } from '@shared/address/address.dto';
import { AppController } from '@common/decorator/app_controller.decorator';

@AppController('address')
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @Post('create')
  async createAddress(
    @Req() request: Request,
    @Res() _: Response,
    @Body() dto: Omit<CreateAddressDto, 'request'>,
  ) {
    return this.service.createAddress(dto);
  }
}
