import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { CoreDto, FindByIdDto, MicroserviceAckDto } from './core.dto';
import Merchant, { LoggedInMerchantUser } from '../schema/ms/merchant.schema';
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
   merchantId: string;
}

export class MerchantVerifyDto extends OmitType(FindByIdDto, ['errorOnNotFound']) {
   @IsAppString('number')
   code: string;
}

export interface MerchantServiceMethods {
   loginUser(dto: MerchantUserLoginDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   nhtp_loginUserAck(dto: MicroserviceAckDto, meta: Metadata): Promise<{ message: string }>;

   nhtp_createMerchant(dto: CreateMerchantDto, meta: Metadata): Promise<{ data: Merchant }>;

   nhtp_createMerchantAck(dto: MicroserviceAckDto, meta: Metadata): Promise<{ message: string }>;

   findById(dto: FindByIdDto, meta: Metadata): Promise<{ data: Merchant }>;

   nhtp_findByIdAck(dto: MicroserviceAckDto, meta: Metadata): Promise<{ message: string }>;

   merchantWithAuth(dto: FindByIdDto, meta: Metadata): Promise<{ data: AuthMerchant }>;

   nhtp_merchantWithAuthAck(dto: MicroserviceAckDto, meta: Metadata): Promise<{ message: string }>;

   tmpTst(meta: Metadata): { data: string };

   nhtp_tmpTstAck(dto: MicroserviceAckDto, meta: Metadata): { message: string };
}
