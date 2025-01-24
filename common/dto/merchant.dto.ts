import { IntersectionType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { AuthenticateMfaDto, BaseDto, FindByIdDto } from './core.dto';
import Merchant, { LoggedInMerchantUser } from '../ms_schema/merchant.schema';
import { Type } from 'class-transformer';
import { CategoryNoTypeDto } from '@shared/category/category.dto';

export class CreateMerchantDto extends IntersectionType(
   BaseDto,
   PickType(Merchant, ['name', 'mail', 'mobileNo']),
) {
   @IsOptional()
   @IsMongoId()
   _id?: string;

   @IsNotEmpty()
   @ValidateNested()
   @Type(() => CategoryNoTypeDto)
   category: CategoryNoTypeDto;

   @IsOptional()
   @IsMongoId()
   addressId: string;
}

export class MerchantUserLoginDto extends IntersectionType(BaseDto, LoggedInMerchantUser) {
   @IsMongoId()
   merchantId: string;
}

export class MerchantVerifyDto extends IntersectionType(BaseDto, AuthenticateMfaDto) {
   @IsMongoId()
   id: string;
}

export interface MerchantServiceMethods {
   loginUser(dto: MerchantUserLoginDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   createMerchant(dto: CreateMerchantDto, meta: Metadata): Promise<{ data: Merchant }>;

   merchantWithAuth(dto: FindByIdDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   tmpTst(dto, meta: Metadata): { data: { message: string } };
}
