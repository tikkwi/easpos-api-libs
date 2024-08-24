import { SetMetadata } from '@nestjs/common';
import { AllowedUser } from '@common/dto/global/core.dto';
import { SKIP_USERS } from '@common/constant';

export const SkipUsers = (users: AllowedUser[]) => SetMetadata(SKIP_USERS, users);
