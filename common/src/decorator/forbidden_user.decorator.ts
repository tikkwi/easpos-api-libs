import { FORBIDDEN_USERS } from '@common/constant';
import { AllowedUser } from '@common/decorator';
import { SetMetadata } from '@nestjs/common';

export const ForbiddenUsers = (users: AllowedUser[]) =>
  SetMetadata(FORBIDDEN_USERS, users);
