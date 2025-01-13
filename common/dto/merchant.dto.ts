import { IntersectionType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDto, CoreDto, FindByIdDto } from './core.dto';
import Merchant, { LoggedInMerchantUser } from '../schema/ms/merchant.schema';
import { IsAppString } from '../validator';
import { CategoryDto } from '@shared/category/category.dto';

export class CreateMerchantDto extends OmitType(CoreDto(Merchant), ['status', 'type']) {
   @IsNotEmpty()
   @ValidateNested()
   @Type(() => CategoryDto)
   category: CategoryDto;
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

   nhtp_createMerchant(dto: CreateMerchantDto, meta: Metadata): Promise<{ data: Merchant }>;

   merchantWithAuth(dto: FindByIdDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   tmpTst(dto, meta: Metadata): { data: { message: string } };
}
