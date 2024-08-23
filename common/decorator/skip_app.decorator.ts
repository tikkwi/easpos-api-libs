import { SKIP_APPS } from '@constant/decorator.constant';
import { AllowedApp } from '@global_dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const SkipApps = (apps: AllowedApp[]) => SetMetadata(SKIP_APPS, apps);
