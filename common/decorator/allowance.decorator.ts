import { SetMetadata } from '@nestjs/common';
import { AllowedApp, AllowedUser } from '@common/dto/core.dto';
import { APPS, SKIP_APPS, SKIP_USERS, USERS } from '@common/constant';

export const Apps = (apps: AllowedApp[]) => SetMetadata(APPS, apps);

export const SkipApps = (apps: AllowedApp[]) => SetMetadata(SKIP_APPS, apps);

export const Users = (users: AllowedUser[]) => SetMetadata(USERS, users);

export const SkipUsers = (users: AllowedUser[]) => SetMetadata(SKIP_USERS, users);
