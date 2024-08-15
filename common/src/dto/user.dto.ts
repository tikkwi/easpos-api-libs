import { User } from '@common/schema/user.schema';
import { regex } from '@common/utils/regex';
import { OmitType } from '@nestjs/swagger';
import {
   IsEmail,
   IsEnum,
   IsMongoId,
   IsString,
   Matches,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { CoreDto, FindDto } from './core.dto';
import { Admin } from '@common/schema/admin.schema';
import { MerchantUser } from '@common/schema/merchant_user.schema';
import { Customer } from '@common/schema/customer.schema';
import { Partner } from '@common/schema/partner.schema';
import { EUser } from '@common/utils/enum';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@shared/address/address.dto';

export class GetUserDto extends FindDto {
   @IsMongoId()
   id?: string;

   @Matches(regex.userName)
   userName?: string;

   @IsEmail()
   mail?: string;
}

export class LoginDto {
   @ValidateIf((o) => !!!o.userName)
   @IsEmail()
   email?: string;

   @ValidateIf((o) => !!!o.email)
   @Matches(regex.userName)
   userName?: string;

   @IsString()
   password: string;
}

export class CreateUserDto extends OmitType(CoreDto(User), ['status', 'tmpBlock', 'mfa']) {
   @ValidateNested()
   @Type(() => CreateAddressDto)
   addressDto: CreateAddressDto;
}

type UserReturn = { data: Admin | MerchantUser | Customer | Partner };
type AdminReturn = { data: Admin };
type MerchantUserReturn = { data: MerchantUser };
type CustomerReturn = { data: Customer };
type PartnerReturn = { data: Partner };

export class UserServiceGetUserDto extends GetUserDto {
   @IsEnum(EUser)
   type: EUser;
}

export interface UserServiceMethods {
   getUser(dto: UserServiceGetUserDto, meta?: Metadata): Promise<UserReturn>;
}

export interface AdminServiceMethods {
   getUser(dto: GetUserDto): Promise<AdminReturn>;
}

export interface MerchantUserServiceMethods {
   getUser(dto: GetUserDto): Promise<MerchantUserReturn>;
}

export interface CustomerServiceMethods {
   getUser(dto: GetUserDto): Promise<CustomerReturn>;
}

export interface PartnerServiceMethods {
   getUser(dto: GetUserDto): Promise<PartnerReturn>;
}
