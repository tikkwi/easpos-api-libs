import { AUTH_CREDENTIAL, MERCHANT, USERS } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser, EApp, EAuthCredential, EUser } from '@common/utils/enum';
import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { APP_MERCHANT } from '@common/constant/db.constant';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { authenticateBasicAuth, getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { intersection } from 'lodash';
import { Request } from 'express';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { AuthCredential } from '@common/schema/auth_credential.schema';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';

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
         const user = this.context.get('user');
         const request: Request = context.switchToHttp().getRequest();

         if (!allowedUsers.length || allowedUsers.includes(EAllowedUser.Any)) return true;
         if (user) {
            const allowedMerchantUser = intersection(allowedUsers, [
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
                  key: APP_MERCHANT,
                  app: EApp.Admin,
               });

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
            key: `lcl_cre_${EAuthCredential.AdminRpc}`,
            app: EApp.Admin,
         });
         return await authenticateBasicAuth(basicAuth, authHeader);
      }
   }
}
