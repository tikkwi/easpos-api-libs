import { APPS, USERS } from '@constant/decorator.constant';
import { AUTH_CREDENTIAL, MERCHANT } from '@constant/model.constant';
import { ContextService } from '@core/context/context.service';
import { AllowedUser } from '@global_dto/core.dto';
import { EAllowedUser, EApp, EUser } from '@utils/enum';
import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppBrokerService } from '@core/app_broker/app_broker.service';
import { authenticateBasicAuth, getServiceToken } from '@utils/misc';
import { MerchantServiceMethods } from '@service_dto/merchant.dto';
import { intersection } from 'lodash';
import { Request } from 'express';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { AuthCredential } from '@service_schema/auth_credential.schema';
import { AuthCredentialServiceMethods } from '@service_dto/auth_credential.dto';

/*
TODO,NOTE cache authorized status up to 1 day which mean merchant_user may able to
authorized 1 day max even if subscription is expired..
*/
@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
      private readonly context: ContextService,
      private readonly broker: AppBrokerService,
      @Inject(getServiceToken(AUTH_CREDENTIAL))
      private readonly credService: AuthCredentialServiceMethods,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {}

   async canActivate(context: ExecutionContext) {
      const isHttp = context.getType() === 'http';
      if (isHttp) {
         const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
         const allowedApps = this.reflector.get(APPS, context.getHandler());
         const user = this.context.get('user');
         const request: Request = context.switchToHttp().getRequest();

         if (!allowedUsers.length || allowedUsers.includes(EAllowedUser.Any)) return true;
         if (user) {
            if (allowedApps?.length && !allowedApps.includes(user.app)) return false;

            const allowedMerchantUser = intersection(allowedUsers, [
               EAllowedUser.MerchantNoVerified,
               EAllowedUser.MerchantNoSub,
               EAllowedUser.Merchant,
               EAllowedUser.Owner,
            ]);

            if (
               !(user.type === EUser.Merchant && allowedMerchantUser.length) ||
               !allowedUsers.includes(user.type)
            )
               return false;

            const gotPermission = this.context
               .get('user')
               .permissions.hasOwnProperty(request.originalUrl);

            if (user.type === EUser.Merchant) {
               const authMerchant = await this.broker.request<AppMerchant>({
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
            key: 'adm_auth_cred',
            app: EApp.Admin,
         });
         return await authenticateBasicAuth(basicAuth, authHeader);
      }
   }
}
