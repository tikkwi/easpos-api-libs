import { regex } from '@app/helper';
import { User } from '@app/schema';
import { CoreDto, FindByIdDto, FindDto } from '@app/types';
import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, Matches } from 'class-validator';
import { Observable } from 'rxjs';

export class GetUserDto extends FindDto {
  @IsMongoId()
  id?: string;

  @Matches(regex.userName)
  userName?: string;

  @IsEmail()
  mail?: string;
}

export class CreateUserDto extends OmitType(CoreDto(User), ['merchant', 'appPermissions']) {
  @IsNotEmpty()
  @IsMongoId()
  merchantId: string;
}

export type UserReturn = { data: User };
export type CreateUserReturn = UserReturn & RollBack;

export interface UserControllerMethods {
  getUser(dto: GetUserDto, meta: Meta): Promise<UserReturn>;
  userWithAuth(dto: FindByIdDto, meta: Meta): Promise<UserReturn>;
  createUser(dto: Observable<CreateUserDto>, meta: Meta): Observable<CreateUserReturn>;
}

export interface UserServiceMethods extends Omit<UserControllerMethods, 'createUser'> {
  createUser(dto: CreateUserDto, meta: Meta): Promise<CreateUserReturn>;
}
