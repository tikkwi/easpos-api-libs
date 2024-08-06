import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export type AppConfigReturn = { data: AppConfig };

export interface AppConfigServiceMethods {
   getConfig(): Promise<AppConfigReturn>;
}

export interface AppConfigSharedServiceMethods {
   getConfig(dto, meta?: Metadata): Observable<GrpcReturn & AppConfigReturn>;
}
