import { SetMetadata } from '@nestjs/common';
import { USERS } from '@common/constant';
import { AllowedUser } from '@common/dto/global/core.dto';

export const Users = (users: AllowedUser[]) => SetMetadata(USERS, users);
