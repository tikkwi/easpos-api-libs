import { AppController } from '@app/decorator';
import { Body, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateAddressDto } from './address.dto';
import { AddressService } from './address.service';

@AppController('shared-api/address')
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @Post('create')
  async createAddress(
    @Req() request: Request,
    @Res() _: Response,
    @Body() dto: Omit<CreateAddressDto, 'request'>,
  ) {
    return this.service.createAddress({ ...dto, request });
  }
}
