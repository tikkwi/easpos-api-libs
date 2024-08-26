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
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@common/dto/global/address.dto';
import { regex } from '@common/utils/regex';
import { EUserApp } from '@common/utils/enum';
import { User } from '@common/schema/global/user.schema';

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

   @IsEnum(EUserApp)
   app: EUserApp;
}

export class CreateUserDto extends OmitType(CoreDto(User), ['status', 'tmpBlock', 'mfa']) {
   @ValidateNested()
   @Type(() => CreateAddressDto)
   addressDto: CreateAddressDto;
}
