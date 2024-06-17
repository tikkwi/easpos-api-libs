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
  @Type(() => CreateAddressDto)
  addressDto: CreateAddressDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OmitType(CreateUserDto, ['merchantId']))
  userDto: Omit<CreateUserDto, 'request' | 'merchantId'>;
}

type MerchantReturn = { data: Merchant };

export interface MerchantServiceMethods {
  getMerchant(dto: FindByIdDto): Promise<MerchantReturn>;
  merchantWithAuth(
    dto: FindByIdDto,
  ): Promise<{ data: Merchant; isSubActive: boolean }>;
  createMerchant(dto: CreateMerchantDto): Promise<MerchantReturn>;
}

export interface MerchantSharedServiceMethods extends MerchantServiceMethods {}
