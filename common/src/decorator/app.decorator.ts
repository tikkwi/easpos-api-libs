import { APPS } from '@common/constant';
import { AllowedApp } from '@common/dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const Apps = (apps: AllowedApp[]) => SetMetadata(APPS, apps);
