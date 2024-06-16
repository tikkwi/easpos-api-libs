import { OmitType } from '@nestjs/swagger';
import { CreateUserDto, FindByIdDto, CategoryDto, CoreDto, CreateAddressDto } from '@app/types';
import { Merchant } from '@app/schema';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Observable } from 'rxjs';

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
type CreateMerchantReturn = RollBack & MerchantReturn;

export interface MerchantControllerMethods {
  getMerchant(dto: FindByIdDto, meta: Meta): Promise<MerchantReturn>;
  merchantWithAuth(dto: FindByIdDto, meta: Meta): Promise<{ data: Merchant; isSubActive: boolean }>;
  createMerchant(dto: Observable<CreateMerchantDto>, meta: Meta): Observable<CreateMerchantReturn>;
}

export interface MerchantServiceMethods extends Omit<MerchantControllerMethods, 'createMerchant'> {
  createMerchant(dto: CreateMerchantDto, meta: Meta): Promise<CreateMerchantReturn>;
}
