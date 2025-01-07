import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { intersection } from 'lodash';
import { Request } from 'express';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { authenticateBasicAuth } from '@common/utils/misc';
import { APPS, AUTH_CREDENTIAL, MERCHANT, USERS } from '@common/constant';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser, EApp, EUser } from '@common/utils/enum';
import { MerchantServiceMethods } from '../dto/merchant.dto';
import AppBrokerService from '../core/app_broker/app_broker.service';
import { getServiceToken } from '../utils/regex';

@Injectable()
export default class AuthGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
      private readonly moduleRef: ModuleRef,
      private readonly broker: AppBrokerService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
      @Inject(getServiceToken(AUTH_CREDENTIAL))
      private readonly credService: AuthCredentialServiceMethods,
   ) {}

   async canActivate(context: ExecutionContext) {
      const isHttp = context.getType() === 'http';
      const request: Request = isHttp ? context.switchToHttp().getRequest<Request>() : undefined;

      const reqCtx: RequestContext = isHttp
         ? request.body.ctx
         : (context.switchToRpc() as any).args[2].metadata.getMap()['ctx'];

      if (isHttp) {
         const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
         const allowedApps = this.reflector.get(APPS, context.getHandler());

         if (!allowedUsers.length || allowedUsers.includes(EAllowedUser.Any)) return true;
         if (reqCtx.user) {
            if (allowedApps?.length && !allowedApps.includes(reqCtx.user.app)) return false;

            const allowedMerchantUser = intersection(allowedUsers, [
               EAllowedUser.MerchantNoVerified,
               EAllowedUser.MerchantNoSub,
               EAllowedUser.Employee,
               EAllowedUser.Owner,
            ]);

            if (
               (reqCtx.user.type === EUser.Employee && !allowedMerchantUser.length) ||
               !allowedUsers.includes(reqCtx.user.type)
            )
               return false;

            const gotPermission = Object.hasOwn(reqCtx.user.permissions, request.originalUrl);

            if (reqCtx.user.type === EUser.Employee) {
               const authMerchant = await this.broker.request<AuthMerchant>({
                  action: (meta) =>
                     this.merchantService.merchantWithAuth(
                        { ctx: reqCtx, id: reqCtx.user.id },
                        meta,
                     ),
                  cache: true,
                  key: 'merchant',
                  app: EApp.Admin,
                  ctx: reqCtx,
                  onClientFinished: (success, meta) =>
                     this.merchantService.nhtp_merchantWithAuthAck({ success }, meta),
               });
               if (
                  !authMerchant.merchant.verified &&
                  !allowedUsers.includes(EAllowedUser.MerchantNoVerified)
               )
                  return false;

               if (
                  !authMerchant.merchant ||
                  (!authMerchant.isSubActive &&
                     !allowedMerchantUser.includes(EAllowedUser.MerchantNoSub))
               )
                  return false;

               if (reqCtx.user.isOwner) return true;
            }

            return gotPermission;
         } else throw new UnauthorizedException();
      } else {
         const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         const authHeader = (context.switchToRpc() as any).args[2].metadata
            .getMap()
            .authorization?.toString();

         const basicAuth = await this.broker.request<AuthCredential>({
            action: (meta) =>
               this.credService.getAuthCredential(
                  {
                     ctx: reqCtx,
                     url: ctx.getPath(),
                     ip: ctx.getPeer().replace(/:\d+$/, ''),
                  },
                  meta,
               ),
            cache: true,
            key: 'a_adm_auth_cred',
            app: EApp.Admin,
            ctx: reqCtx,
            onClientFinished: (success, meta) =>
               this.credService.nhtp_getAuthCredentialAck({ success }, meta),
         });
         return await authenticateBasicAuth(basicAuth, authHeader);
      }
   }
}
