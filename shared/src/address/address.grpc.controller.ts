import { Controller } from '@nestjs/common';
import { AddressService } from './address.service';
import { GrpcHandler } from '@app/decorator';
import { FindByIdDto } from '@app/dto';

@GrpcHandler()
export class AddressGrpcController {
  constructor(private readonly service: AddressService) {}

  async getAddress(dto: FindByIdDto) {
    return this.service.getAddress(dto);
  }
}
