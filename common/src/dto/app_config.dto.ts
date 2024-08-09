export type AppConfigReturn = { data: AppConfig };

export interface AppConfigServiceMethods {
   getConfig(): Promise<AppConfigReturn>;
}
