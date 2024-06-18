import { CategoryDto, CoreDto, CreateUserDto, FindByIdDto } from '@common/dto';
import { Merchant } from '@common/schema';
import { OmitType } from '@nestjs/swagger';
import { CreateAddressDto } from '@shared/dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateMerchantDto extends OmitType(CoreDto(Merchant), [
  'activePurchase',
  'owner',
  'status',
  'type',
  'address',
]) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OmitType(CreateAddressDto, ['request']))
  addressDto: Omit<CreateAddressDto, 'request'>;

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
  getMerchant(
    dto: FindByIdDto,
    logTrail?: RequestLog[],
  ): Promise<MerchantReturn>;
  merchantWithAuth(
    dto: FindByIdDto,
    logTrail?: RequestLog[],
  ): Promise<{ data: Merchant; isSubActive: boolean }>;
  createMerchant(
    dto: CreateMerchantDto,
    logTrail?: RequestLog[],
  ): Promise<MerchantReturn>;
}

export interface MerchantSharedServiceMethods extends MerchantServiceMethods {}
