import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { BaseDto, FindByIdDto } from './core.dto';
import Merchant, { LoggedInMerchantUser } from '../schema/ms/merchant.schema';
import { IsAppString } from '../validator';
import { Type } from 'class-transformer';
import { CategoryDto } from '@shared/category/category.dto';

export class CreateMerchantDto extends IntersectionType(
   BaseDto,
   PartialType(PickType(Merchant, ['_id'])),
   PickType(Merchant, ['name', 'mail', 'mobileNo']),
) {
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

export class MerchantVerifyDto extends OmitType(FindByIdDto, ['errorOnNotFound']) {
   @IsAppString('number')
   code: string;
}

export interface MerchantServiceMethods {
   loginUser(dto: MerchantUserLoginDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   createMerchant(dto: CreateMerchantDto, meta: Metadata): Promise<{ data: Merchant }>;

   merchantWithAuth(dto: FindByIdDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   tmpTst(dto, meta: Metadata): { data: { message: string } };
}
