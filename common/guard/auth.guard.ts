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
import RequestContextService from '../core/request_context/request_context_service';
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
      const contextService = await this.moduleRef.resolve(RequestContextService);
      if (isHttp) {
         const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
         const allowedApps = this.reflector.get(APPS, context.getHandler());
         const user = contextService.get('user');
         const request: Request = context.switchToHttp().getRequest();

         if (!allowedUsers.length || allowedUsers.includes(EAllowedUser.Any)) return true;
         if (user) {
            if (allowedApps?.length && !allowedApps.includes(user.app)) return false;

            const allowedMerchantUser = intersection(allowedUsers, [
               EAllowedUser.MerchantNoVerified,
               EAllowedUser.MerchantNoSub,
               EAllowedUser.Employee,
               EAllowedUser.Owner,
            ]);

            if (
               (user.type === EUser.Employee && !allowedMerchantUser.length) ||
               !allowedUsers.includes(user.type)
            )
               return false;

            const gotPermission = Object.hasOwn(
               contextService.get('user').permissions,
               request.originalUrl,
            );

            if (user.type === EUser.Employee) {
               const authMerchant = await this.broker.request<AuthMerchant>({
                  action: (meta) => this.merchantService.merchantWithAuth({ id: user.id }, meta),
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

               if (user.isOwner) return true;
            }

            return gotPermission;
         } else throw new UnauthorizedException();
      } else {
         const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         const authHeader = ctx.metadata.getMap().authorization?.toString();

         const basicAuth = await this.broker.request<AuthCredential>({
            action: (meta) =>
               this.credService.getAuthCredential(
                  {
                     url: ctx.getPath(),
                     ip: ctx.getPeer().replace(/:\d+$/, ''),
                  },
                  meta,
               ),
            cache: true,
            key: 'a_adm_auth_cred',
            app: EApp.Admin,
         });
         return await authenticateBasicAuth(basicAuth, authHeader);
      }
   }
}
