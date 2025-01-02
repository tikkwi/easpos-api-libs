import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { decrypt } from '@common/utils/encrypt';
import { ModuleRef } from '@nestjs/core';
import RequestContextService from '../core/request_context/request_context_service';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { AuthUser } from '../dto/entity.dto';

@Injectable()
export default class TransformGuard implements CanActivate {
   constructor(private readonly moduleRef: ModuleRef) {}

   async canActivate(context: ExecutionContext) {
      const contextService = await this.moduleRef.resolve(RequestContextService);
      const request: Request =
         context.getType() === 'http' ? context.switchToHttp().getRequest() : undefined;
      if (context.getType() === 'http') {
         let user: AuthUser;
         if (request.session.user) user = await decrypt<AuthUser>(request.session.user);

         contextService.set({
            user,
            ip: request.ip,
            // requestedApp: process.env[APP],
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
      if (request?.originalUrl !== '/login') await contextService.startSession();

      return true;
   }
}
