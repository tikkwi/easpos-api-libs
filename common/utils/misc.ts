import {
   ForbiddenException,
   HttpException,
   HttpStatus,
   InternalServerErrorException,
   Provider,
} from '@nestjs/common';
import { ClientGrpc, ClientsModuleOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { getServiceToken } from './regex';
import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { ADMIN_URL, REQUESTED_APP, USER_AGENT } from '@common/constant';
import process from 'node:process';
import AppContext from '../core/app_context.service';
import { Connection, Schema } from 'mongoose';

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

export const getGrpcContext = async (meta: Metadata): Promise<RequestContext> => {
   const merchantId = meta.get('merchantId')[0] as string;
   const [connection, session] = await AppContext.getSession(merchantId);
   return {
      connection,
      session,
      requestedApp: meta.get(REQUESTED_APP)[0] as EApp,
      userAgent: meta.get(USER_AGENT)[0] as string,
      logTrail: [],
      merchantId,
      contextType: 'rpc',
   };
};

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

export const initializeCollections = (conn: Connection, schemas: Array<[string, Schema]>) => {
   for (const [name, schema] of schemas) {
      conn.model(name, schema);
   }
};

export const connectMerchantDb = async (ctx: RequestContext, id: string, isNew = false) => {
   if (ctx.connection) throw new InternalServerErrorException('Connection already exists');
   const [connection, session] = await AppContext.getSession(id, isNew);
   ctx.connection = connection;
   ctx.session = session;
   ctx.merchantId = id;
};

export const getSmallestGreaterThanKey = (obj: Record<number, number>, count: number) =>
   Object.keys(obj)
      .filter((k) => +k >= count)
      .sort((a, b) => +a - +b)[0];
