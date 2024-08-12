import { SKIP_USERS } from '@common/constant';
import { AllowedUser } from '@common/dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const SkipUsers = (users: AllowedUser[]) => SetMetadata(SKIP_USERS, users);
