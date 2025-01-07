import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ModuleRef } from '@nestjs/core';
import process from 'node:process';
import { decrypt } from '../utils/encrypt';
import { ServerUnaryCall } from '@grpc/grpc-js';
import AppContext from '../core/app_context.service';

@Injectable()
export default class TransformGuard implements CanActivate {
   constructor(private readonly moduleRef: ModuleRef) {}

   async canActivate(context: ExecutionContext) {
      // const request: Request =
      //    context.getType() === 'http' ? context.switchToHttp().getRequest() : undefined;
      // contextService.set({ contextType: context.getType() });

      if (context.getType() === 'http') {
         const request: Request = context.switchToHttp().getRequest();
         let user: AuthUser;
         if (request.session.user) user = await decrypt<AuthUser>(request.session.user);
         const ctx = {};
         request.body.ctx = ctx;

         ctx['user'] = user;
         ctx['ip'] = request.ip;
         ctx['requestedApp'] = process.env['APP'];
         ctx['userAgent'] = request.headers['user-agent'];
      } else {
         const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         const meta = ctx.metadata.getMap();
         const reqCtx: RequestContext = meta.ctx;
         const connection = AppContext.getConnection(reqCtx.merchantId);
         reqCtx.connection = connection;
         // reqCtx.session = await connection.startSession();
         // contextService.set({
         //    ip: ctx.getPath(),
         //    userAgent: meta['user-agent'] as string,
         //    requestedApp: meta.app as EApp,
         // });
      }
      if (request?.originalUrl !== '/login') await contextService.startSession();
      return true;
   }
}
