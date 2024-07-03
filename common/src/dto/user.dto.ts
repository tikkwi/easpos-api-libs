import { User } from '@common/schema/user.schema';
import { regex } from '@common/utils/regex';
import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CoreDto, FindByIdDto, FindDto } from './core.dto';
import { Metadata } from '@grpc/grpc-js';
import { AuthUser } from './entity.dto';

export class GetUserDto extends FindDto {
  @IsMongoId()
  id?: string;

  @Matches(regex.userName)
  userName?: string;

  @IsEmail()
  mail?: string;
}

export class CreateUserDto extends OmitType(CoreDto(User), [
  'merchant',
  'servicePermissions',
  'status',
]) {
  @IsOptional()
  @ValidateNested()
  @Type(() => AuthUser)
  authUser?: AuthUser;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  permissions?: string[];

  @IsOptional()
  @IsMongoId()
  merchantId?: string;
}

export class UserWihAuthDto extends FindByIdDto {
  @IsString()
  service: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @ValidateIf((o) => !!!o.url)
  @IsString()
  @IsNotEmpty()
  auxillaryService?: string;
}

export type UserReturn = { data: User };

export interface UserServiceMethods {
  getUser(dto: GetUserDto): Promise<UserReturn>;
  createUser(dto: CreateUserDto): Promise<UserReturn>;
}

export interface UserSharedServiceMethods {
  getUser(dto: GetUserDto, meta?: Metadata): Promise<UserReturn>;
  createUser(dto: CreateUserDto, meta?: Metadata): Promise<UserReturn>;
}
