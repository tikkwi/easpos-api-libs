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
import { APPS, AUTH_CREDENTIAL, AUTHORIZATION, MERCHANT, USERS } from '@common/constant';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser, EApp, EAuthCredential, EUser } from '@common/utils/enum';
import { MerchantServiceMethods } from '../dto/merchant.dto';
import AppBrokerService from '../core/app_broker/app_broker.service';
import { getServiceToken, parseGrpcPath } from '../utils/regex';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { authenticateBasicAuth, getGrpcContext } from '../utils/misc';

@Injectable()
export default class AuthGuard implements CanActivate {
   constructor(
      private readonly moduleRef: ModuleRef,
      private readonly reflector: Reflector,
      private readonly broker: AppBrokerService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
      @Inject(getServiceToken(AUTH_CREDENTIAL))
      private readonly credService: AuthCredentialServiceMethods,
   ) {}

   async canActivate(context: ExecutionContext) {
      const isHttp = context.getType() === 'http';
      const request: Request = isHttp ? context.switchToHttp().getRequest<Request>() : undefined;

      if (isHttp) {
         const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
         const allowedApps = this.reflector.get(APPS, context.getHandler());
         const reqCtx = request.body.ctx;
         if (!allowedUsers?.length || allowedUsers.includes(EAllowedUser.Any)) return true;
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
         const call: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         call.request.ctx = await getGrpcContext(call.metadata);
         const authHeader = call.metadata.get(AUTHORIZATION)[0] as string;
         const basicAuth = await this.broker.request<AuthCredential>({
            action: async (meta) =>
               this.credService.getAuthCredential(
                  {
                     ctx: await getGrpcContext(call.metadata),
                     type: EAuthCredential.AdminRpc,
                  },
                  meta,
               ),
            app: EApp.Admin,
            cache: true,
            key: 'a_adm_auth_cred_adm_rpc',
         });
         const isAuthenticated = await authenticateBasicAuth(basicAuth, authHeader);
         if (isAuthenticated) {
            const [_, srv, pth] = parseGrpcPath(call.getPath());
            return (
               Object.hasOwn(basicAuth.authServices, srv) &&
               basicAuth.authServices[srv].includes(pth)
            );
         }
         return false;
      }
   }
}
