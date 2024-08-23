import { APPS } from '@constant/decorator.constant';
import { AllowedApp } from '@global_dto/core.dto';
import { SetMetadata } from '@nestjs/common';

export const Apps = (apps: AllowedApp[]) => SetMetadata(APPS, apps);
