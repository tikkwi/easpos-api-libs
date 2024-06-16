import { FORBIDDEN_USERS } from '@app/constant';
import { AllowedUser } from '@app/decorator';
import { SetMetadata } from '@nestjs/common';

export const ForbiddenUsers = (users: AllowedUser[]) => SetMetadata(FORBIDDEN_USERS, users);
