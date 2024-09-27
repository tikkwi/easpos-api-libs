import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { decrypt } from '@common/utils/encrypt';
import { ModuleRef } from '@nestjs/core';
import ContextService from '../core/context/context.service';
import * as process from 'node:process';
import { APP } from '../constant';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { AuthUser } from '../dto/entity.dto';
import MerchantConfig from '@app/merchant_config/merchant_config.schema';

@Injectable()
export default class TransformGuard implements CanActivate {
   constructor(private readonly moduleRef: ModuleRef) {}

   async canActivate(context: ExecutionContext) {
      const contextService = await this.moduleRef.resolve(ContextService);
      await contextService.initialize();
      if (context.getType() === 'http') {
         const request: Request = context.switchToHttp().getRequest();

         let user: AuthUser, merchantConfig: MerchantConfig;
         if (request.session.user) user = await decrypt<AuthUser>(request.session.user);
         if (request.session.merchantConfig)
            merchantConfig = await decrypt<MerchantConfig>(request.session.merchantConfig);

         contextService.set({
            user,
            merchantConfig,
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
