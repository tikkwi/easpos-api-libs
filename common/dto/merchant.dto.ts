import { IntersectionType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { BaseDto, FindByIdDto } from './core.dto';
import Merchant, { LoggedInMerchantUser } from '../schema/ms/merchant.schema';
import { Type } from 'class-transformer';
import { CategoryDto } from '@shared/category/category.dto';

export class CreateMerchantDto extends IntersectionType(
   BaseDto,
   PickType(Merchant, ['name', 'mail', 'mobileNo']),
) {
   @IsOptional()
   @IsMongoId()
   _id?: string;

   @IsNotEmpty()
   @ValidateNested()
   @Type(() => CategoryDto)
   category: CategoryDto;

   @IsOptional()
   @IsMongoId()
   addressId: string;
}

export class MerchantUserLoginDto extends IntersectionType(BaseDto, LoggedInMerchantUser) {
   @IsMongoId()
   merchantId: string;
}

export interface MerchantServiceMethods {
   loginUser(dto: MerchantUserLoginDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   createMerchant(dto: CreateMerchantDto, meta: Metadata): Promise<{ data: Merchant }>;

   merchantWithAuth(dto: FindByIdDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   tmpTst(dto, meta: Metadata): { data: { message: string } };
}
