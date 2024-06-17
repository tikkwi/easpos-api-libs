import { USERS } from '@common/constant';
import { EAllowedUser } from '@common/utils';
import { SetMetadata } from '@nestjs/common';

export type AllowedUser = keyof typeof EAllowedUser;
export const Users = (users: AllowedUser[]) => SetMetadata(USERS, users);
