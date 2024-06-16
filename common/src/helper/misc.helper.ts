import { EAuthCredential, firstUpperCase } from '@app/helper';
import { Provider } from '@nestjs/common';
import { ClientGrpc, ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { Response } from 'express';
import { camelCase } from 'lodash';
import { join } from 'path';

export const any = (obj: any, key: string) => obj[key];

export const responseError = (res: Response, error: any) => {
  if (error.status) return res.status(error.status).send({ message: error.message });

  switch (error.constructor.name) {
    case 'ValidationError':
      return res.status(400).send({ message: error.message });

    case 'MongoServerError':
      return res.status(400).send({ message: error.message });

    case 'TypeError':
      return res.status(400).send({ message: error.message });

    default:
      return res.status(500).send({ message: 'Something wrong in the server' });
  }
};

export const getServiceToken = (model: string) => `${firstUpperCase(camelCase(model))}Service`;

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

export const getGrpcClient = (models: string[]): [ClientsModuleOptions, Provider[]] => [
  getGrpcClientOptions(models),
  getGrpcServiceProviders(models),
];
