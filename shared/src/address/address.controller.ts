import { AppController } from '@common/decorator/app_controller.decorator';
import { Body, Post } from '@nestjs/common';
import { CreateAddressDto } from '@shared/address/address.dto';
import { AddressService } from './address.service';

@AppController('address')
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @Post('create')
  async createAddress(@Body() dto: Omit<CreateAddressDto, 'request'>) {
    return this.service.createAddress(dto);
  }
}
