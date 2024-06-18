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
  'servicePermissions',
]) {
  @IsNotEmpty()
  @IsMongoId()
  merchantId: string;
}

export type UserReturn = { data: User };

export interface UserServiceMethods {
  getUser(dto: GetUserDto, logTrail?: RequestLog[]): Promise<UserReturn>;
  userWithAuth(
    dto: FindByIdDto,
    logTrail?: RequestLog[],
  ): Promise<{ data: AuthUser }>;
  createUser(dto: CreateUserDto, logTrail?: RequestLog[]): Promise<UserReturn>;
}

export interface UserSharedServiceMethods extends UserServiceMethods {}
