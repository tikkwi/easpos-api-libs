import { BaseDto, FindDto } from './core.dto';

export type AppConfigReturn = { data: AppConfig };

export interface AppConfigServiceMethods {
  getConfig(dto: BaseDto): Promise<AppConfigReturn>;
}

export interface AppConfigSharedServiceMethods extends AppConfigServiceMethods {}
