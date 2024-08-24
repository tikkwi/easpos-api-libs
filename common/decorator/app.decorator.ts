import { SetMetadata } from '@nestjs/common';
import { AllowedApp } from '@common/dto/global/core.dto';
import { APPS } from '@common/constant';

export const Apps = (apps: AllowedApp[]) => SetMetadata(APPS, apps);
