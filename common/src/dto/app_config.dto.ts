import { FindDto } from './core.dto';

export type AppConfigReturn = { data: AppConfig };

export interface AppConfigServiceMethods {
  getConfig(dto: FindDto, logTrail?: RequestLog[]): Promise<AppConfigReturn>;
}

export interface AppConfigSharedServiceMethods
  extends AppConfigServiceMethods {}
