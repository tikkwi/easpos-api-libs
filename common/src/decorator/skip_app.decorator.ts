import { SKIP_APPS } from '@common/constant';
import { AllowedApp } from '@common/dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const SkipApps = (apps: AllowedApp[]) => SetMetadata(SKIP_APPS, apps);
