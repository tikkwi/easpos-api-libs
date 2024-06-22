import { regex } from '@common/utils/regex';
import { IntersectionType, OmitType } from '@nestjs/swagger';
import { User } from '@common/schema/user.schema';
import { IsEmail, IsMongoId, IsNotEmpty, Matches } from 'class-validator';
import { BaseDto, CoreDto, FindByIdDto, FindDto } from './core.dto';

export class GetUserDto extends FindDto {
  @IsMongoId()
  id?: string;

  @Matches(regex.userName)
  userName?: string;

  @IsEmail()
  mail?: string;
}

export class CreateUserDto extends IntersectionType(
  BaseDto,
  OmitType(CoreDto(User), ['merchant', 'servicePermissions']),
) {
  @IsNotEmpty()
  @IsMongoId()
  merchantId: string;
}

export type UserReturn = { data: User };

export interface UserServiceMethods {
  getUser(dto: GetUserDto): Promise<UserReturn>;
  userWithAuth(dto: FindByIdDto): Promise<{ data: AuthUser }>;
  createUser(dto: CreateUserDto): Promise<UserReturn>;
}
