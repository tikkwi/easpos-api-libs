import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { FindByIdDto } from '@common/dto/core.dto';
import { Inject, Injectable } from '@nestjs/common';
import { AddressServiceMethods, CreateAddressDto } from '@shared/address/address.dto';
import { Address } from './address.schema';

@Injectable()
export class AddressService implements AddressServiceMethods {
  constructor(@Inject(REPOSITORY) private readonly repository: Repository<Address>) {}

  async getAddress({ id, lean = true }: FindByIdDto) {
    return await this.repository.findById({ id, options: { lean } });
  }

  async createAddress(dto: CreateAddressDto) {
    return await this.repository.create(dto);
  }
}
