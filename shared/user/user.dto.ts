import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import {
   IsEmail,
   IsEnum,
   IsMongoId,
   IsOptional,
   IsString,
   Matches,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { regex } from '@common/utils/regex';
import { EUserApp } from '@common/utils/enum';
import { AuthenticateMfaDto, CoreDto, FindDto } from '@common/dto/core.dto';
import User from './user.schema';
import { Type } from 'class-transformer';
import { CategoryDto } from '../category/category.dto';

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
   mail?: string;

   @ValidateIf((o) => !!!o.email)
   @Matches(regex.userName)
   userName?: string;

   @IsString()
   password: string;

   @IsEnum(EUserApp)
   app: EUserApp;

   @IsOptional()
   @IsMongoId()
   merchantId?: string;
}

export class AuthenticateLoginMfaDto extends IntersectionType(
   AuthenticateMfaDto,
   PickType(LoginDto, ['app', 'merchantId']),
) {
   @IsMongoId()
   userId: string;
}

export class CreateUserDto extends OmitType(CoreDto(User), [
   'status',
   'tmpBlock',
   'mfa',
   'mailVerified',
   'mobileVerified',
   'tags',
   'address',
]) {
   @IsOptional()
   @IsMongoId()
   addressId?: string;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => CategoryDto)
   tagsDto?: Array<CategoryDto>;
}
