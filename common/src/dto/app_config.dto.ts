import { Metadata } from '@grpc/grpc-js';

export type AppConfigReturn = { data: AppConfig };

export interface AppConfigServiceMethods {
  getConfig(): Promise<AppConfigReturn>;
}

export interface AppConfigSharedServiceMethods {
  getConfig(dto, meta?: Metadata): Promise<AppConfigReturn>;
}
