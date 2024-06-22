import { IntersectionType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDto, CoreDto, FindByIdDto } from './core.dto';
import { Merchant } from '@common/schema/merchant.schema';
import { CreateAddressDto } from '@shared/address/address.dto';
import { CategoryDto } from './action.dto';
import { CreateUserDto } from './user.dto';

export class CreateMerchantDto extends IntersectionType(
  BaseDto,
  OmitType(CoreDto(Merchant), ['activePurchase', 'owner', 'status', 'type', 'address']),
) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  addressDto: CreateAddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OmitType(CreateUserDto, ['merchantId', 'request']))
  userDto: Omit<CreateUserDto, 'request' | 'merchantId' | 'request'>;
}

type MerchantReturn = { data: Merchant };

export interface MerchantServiceMethods {
  getMerchant(dto: FindByIdDto): Promise<MerchantReturn>;
  merchantWithAuth(dto: FindByIdDto): Promise<{ data: Merchant; isSubActive: boolean }>;
  createMerchant(dto: CreateMerchantDto): Promise<MerchantReturn>;
}
