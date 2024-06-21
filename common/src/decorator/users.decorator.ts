import { USERS } from '@common/constant';
import { AllowedUser } from '@common/dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const Users = (users: AllowedUser[]) => SetMetadata(USERS, users);
