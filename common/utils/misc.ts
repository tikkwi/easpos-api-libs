import { ForbiddenException, HttpException, HttpStatus, Provider } from '@nestjs/common';
import { ClientGrpc, ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { getServiceToken } from './regex';
import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { ADMIN_URL } from '@common/constant';
import process from 'node:process';

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
         protoPath: join(process.cwd(), `dist/common/proto/${pkg.toLowerCase()}.proto`),
      },
   }));

export const getGrpcClient = (
   models: string[],
   url?: string,
): [ClientsModuleOptions, Provider[]] => [
   getGrpcClientOptions(models, url ?? ADMIN_URL),
   getGrpcServiceProviders(models),
];

export const responseError = (req: Request, res: Response, err?: any) => {
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

export const getMongoUri = (id?: string) =>
   `${process.env['MONGO_URI']}/${id ?? ''}?replicaSet=rs0&authSource=admin`;
