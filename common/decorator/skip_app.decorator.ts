import { SetMetadata } from '@nestjs/common';
import { AllowedApp } from '@common/dto/global/core.dto';
import { SKIP_APPS } from '@common/constant';

export const SkipApps = (apps: AllowedApp[]) => SetMetadata(SKIP_APPS, apps);
