import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { CoreDto, FindByIdDto } from './core.dto';
import Merchant, { LoggedInMerchantUser } from '@common/schema/merchant.schema';
import { IsAppString } from '../validator';
import { CategoryDto } from '@shared/category/category.dto';

export class CreateMerchantDto extends OmitType(CoreDto(Merchant), ['status', 'type']) {
   @IsNotEmpty()
   @ValidateNested()
   @Type(() => CategoryDto)
   category: CategoryDto;
}

export class MerchantUserLoginDto extends LoggedInMerchantUser {
   @IsMongoId()
   id: string;
}

export class MerchantVerifyDto extends OmitType(FindByIdDto, ['errorOnNotFound']) {
   @IsAppString('number')
   code: string;
}

export interface MerchantServiceMethods {
   loginUser(dto: MerchantUserLoginDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   findById(dto: FindByIdDto, meta: Metadata): Promise<{ data: Merchant }>;

   merchantWithAuth(dto: FindByIdDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   tmpTst(meta: Metadata): { data: string };
}
