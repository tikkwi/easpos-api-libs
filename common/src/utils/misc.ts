import { ADMIN_URL, REPOSITORY } from '@common/constant';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { ClientGrpc, ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { camelCase } from 'lodash';
import { join } from 'path';
import { firstUpperCase } from './regex';
import { EAuthCredential, EStatus } from './enum';
import { Repository } from '@common/core/repository';
import { Request, Response } from 'express';
import { ContextService } from '@common/core/context/context.service';
import { compare } from 'bcryptjs';
import dayjs from 'dayjs';

type RepositoryProviderType = { name: string; provide?: string };

export const any = (obj: any, key: string) => obj[key];

export const getServiceToken = (model: string) => `${firstUpperCase(camelCase(model))}Service`;

export const getBasicAuthType = (path: string) => {
  if (/.*\/(swagger$)/.test(path)) return EAuthCredential.Swagger;
};

const getGrpcServiceProviders = (models: string[]): Provider[] => {
  return models.map((model) => {
    const service = getServiceToken(model);
    return {
      provide: service,
      useFactory: async (client: ClientGrpc) => client.getService(service),
      inject: [`${model}_PACKAGE`],
    };
  });
};

const getGrpcClientOptions = (pkgs: string[], url: string): ClientsModuleOptions =>
  pkgs.map((pkg) => ({
    name: `${pkg}_PACKAGE`,
    transport: Transport.GRPC,
    options: {
      package: `${pkg}_PACKAGE`,
      url,
      protoPath: join(process.cwd(), `dist/common/src/proto/${pkg.toLowerCase()}.proto`),
    },
  }));

const repositoryProvider = ({ provide, name }: RepositoryProviderType) => ({
  provide: provide ?? REPOSITORY,
  useFactory: (model, context) => {
    return new Repository(model, context);
  },
  inject: [getModelToken(name), ContextService],
});

export const getGrpcClient = (
  models: string[],
  url?: string,
): [ClientsModuleOptions, Provider[]] => [
  getGrpcClientOptions(models, url ?? ADMIN_URL),
  getGrpcServiceProviders(models),
];

export function getRepositoryProvider(args: RepositoryProviderType): Provider;
export function getRepositoryProvider(args: RepositoryProviderType[]): Provider[];
export function getRepositoryProvider(
  args: RepositoryProviderType | RepositoryProviderType[],
): Provider | Provider[] {
  if (Array.isArray(args)) {
    const pvdr = [];
    let defInc = false;
    args.reduce((acc, { name, provide }) => {
      if (!provide || provide === REPOSITORY) {
        if (!defInc) defInc = true;
        else throw new InternalServerErrorException();
      }
      if (acc.includes(provide)) throw new InternalServerErrorException();
      acc.push(provide);
      pvdr.push(repositoryProvider({ name, provide }));
      return acc;
    }, []);
    return pvdr;
  } else return repositoryProvider(args);
}

export const responseError = (req: Request, res: Response, err: any) => {
  const status = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

  res.status(status).json({
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    message: err.message || 'Internal server erroreee',
  });
};

export const base64 = (str: string) => Buffer.from(str).toString('base64');

export const authenticateBasicAuth = async ({ userName, password }: BasicAuth, cred: string) => {
  const [usr, pass] = Buffer.from(cred.split(' ')[1], 'base64').toString('ascii').split(':');
  if (userName === usr && (await compare(pass, password))) return true;
  throw new ForbiddenException('Incorrect username or password');
};
