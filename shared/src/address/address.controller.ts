import { AppController } from '@common/decorator';
import { Body, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AddressService } from './address.service';
import { CreateAddressDto } from '@shared/dto/address.dto';
import { CoreController } from '@common/core/core.controller';

@AppController('address')
export class AddressController extends CoreController {
  constructor(service: AddressService) {
    super(service);
  }

  @Post('create')
  async createAddress(
    @Req() request: Request,
    @Res() _: Response,
    @Body() dto: Omit<CreateAddressDto, 'request'>,
  ) {
    return this.service.createAddress(dto);
  }
}
