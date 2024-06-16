import { FindDto } from './core.type';

export type AppConfigReturn = { data: AppConfig };

export interface AppConfigControllerMethods {
  getConfig(dto: FindDto, meta: Meta): Promise<AppConfigReturn>;
}

export interface AppConfigServiceMethods extends AppConfigControllerMethods {}
