import { SKIP_USERS } from '@constant/decorator.constant';
import { AllowedUser } from '@global_dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const SkipUsers = (users: AllowedUser[]) => SetMetadata(SKIP_USERS, users);
