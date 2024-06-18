import { EAuthCredential, firstUpperCase } from '@common/utils';
import { Provider } from '@nestjs/common';
import {
  ClientGrpc,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { camelCase } from 'lodash';
import { join } from 'path';

export const any = (obj: any, key: string) => obj[key];

export const getServiceToken = (model: string) =>
  `${firstUpperCase(camelCase(model))}Service`;

export const getBasicAuthType = (path: string) => {
  if (/.*\/(swagger$)/.test(path)) return EAuthCredential.Swagger;
};

const getGrpcServiceProviders = (models: string[]) => {
  return models.map((model) => {
    const service = getServiceToken(model);
    return {
      provide: service,
      useFactory: async (client: ClientGrpc) => client.getService(service),
    };
  });
};

const getGrpcClientOptions = (pkgs: string[]): ClientsModuleOptions =>
  pkgs.map((pkg) => ({
    name: `${pkg}_PACKAGE`,
    transport: Transport.GRPC,
    options: {
      package: `${pkg}_PACKAGE`,
      protoPath: join(__dirname, `../${pkg.toLowerCase()}.proto`),
    },
  }));

export const getGrpcClient = (
  models: string[],
): [ClientsModuleOptions, Provider[]] => [
  getGrpcClientOptions(models),
  getGrpcServiceProviders(models),
];
