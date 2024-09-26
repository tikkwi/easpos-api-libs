import {
   CanActivate,
   ExecutionContext,
   Injectable,
   InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { decrypt } from '@common/utils/encrypt';
import { isPeriodExceed } from '@common/utils/datetime';
import { ModuleRef } from '@nestjs/core';
import ContextService from '../core/context/context.service';
import * as process from 'node:process';
import { APP } from '../constant';
import { ServerUnaryCall } from '@grpc/grpc-js';

@Injectable()
export default class TransformGuard implements CanActivate {
   constructor(private readonly moduleRef: ModuleRef) {}

   async canActivate(context: ExecutionContext) {
      const contextService = await this.moduleRef.resolve(ContextService);
      await contextService.initialize();
      if (context.getType() === 'http') {
         const request: Request = context.switchToHttp().getRequest();

         let user;
         if (request.session.user) {
            ({ user } = await decrypt<any>(request.session.user));

            const isExpireSoon = isPeriodExceed(
               request.session.cookie.expires,
               undefined,
               12,
               'hours',
            )[2];

            if (isExpireSoon)
               request.session.regenerate((err) => {
                  throw new InternalServerErrorException(err);
               });
         }

         contextService.set({
            user,
            ip: request.ip,
            requestedApp: process.env[APP],
            userAgent: request.headers['user-agent'],
         });
      } else {
         const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         const meta = ctx.metadata.getMap();
         contextService.set({
            ip: ctx.getPath(),
            userAgent: meta['user-agent'] as string,
            requestedApp: meta.app as EApp,
         });
      }

      return true;
   }
}
