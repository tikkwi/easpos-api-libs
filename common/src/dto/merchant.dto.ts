import { Merchant } from '@common/schema/merchant.schema';
import { OmitType } from '@nestjs/swagger';
import { CreateAddressDto } from '@shared/address/address.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CategoryDto } from './action.dto';
import { CoreDto, FindByIdDto } from './core.dto';
import { CreateUserDto } from './user.dto';
import { Metadata } from '@grpc/grpc-js';

export class CreateMerchantDto extends OmitType(CoreDto(Merchant), [
  'activePurchase',
  'owner',
  'status',
  'type',
  'address',
]) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}

type MerchantReturn = { data: Merchant };

export interface MerchantServiceMethods {
  getMerchant(dto: FindByIdDto): Promise<MerchantReturn>;
  merchantWithAuth(dto: FindByIdDto): Promise<{ data: Merchant; isSubActive: boolean }>;
  createMerchant(dto: CreateMerchantDto): Promise<MerchantReturn>;
  tmpTst(): { data: string };
}

export interface MerchantSharedServiceMethods {
  getMerchant(dto: FindByIdDto, meta?: Metadata): Promise<MerchantReturn>;
  merchantWithAuth(
    dto: FindByIdDto,
    meta?: Metadata,
  ): Promise<{ data: Merchant; isSubActive: boolean }>;
  createMerchant(dto: CreateMerchantDto, meta?: Metadata): Promise<MerchantReturn>;
  tmpTst(dto, meta?: Metadata): { data: string };
}
