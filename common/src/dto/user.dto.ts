import { CoreDto, FindByIdDto, FindDto } from '@common/dto';
import { regex } from '@common/utils';
import { OmitType } from '@nestjs/swagger';
import { User } from '@common/schema/user.schema';
import { IsEmail, IsMongoId, IsNotEmpty, Matches } from 'class-validator';

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
  'appPermissions',
]) {
  @IsNotEmpty()
  @IsMongoId()
  merchantId: string;
}

export type UserReturn = { data: User };

export interface UserServiceMethods {
  getUser(dto: GetUserDto): Promise<UserReturn>;
  userWithAuth(dto: FindByIdDto): Promise<AuthUser>;
  createUser(dto: CreateUserDto): Promise<UserReturn>;
}

export interface UserSharedServiceMethods extends UserServiceMethods {}
