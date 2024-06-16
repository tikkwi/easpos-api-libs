import { USERS } from '@app/constant';
import { EAllowedUser } from '@app/helper';
import { SetMetadata } from '@nestjs/common';

export type AllowedUser = keyof typeof EAllowedUser;
export const Users = (users: AllowedUser[]) => SetMetadata(USERS, users);
