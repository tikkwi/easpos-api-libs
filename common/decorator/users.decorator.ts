import { USERS } from '@constant/decorator.constant';
import { AllowedUser } from '@global_dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const Users = (users: AllowedUser[]) => SetMetadata(USERS, users);
