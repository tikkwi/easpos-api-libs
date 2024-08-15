import { MERCHANT, USERS } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser, EApp, EUser } from '@common/utils/enum';
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
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { intersection } from 'lodash';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { Request } from 'express';

/*
TODO,NOTE cache authorized status up to 1 day which mean merchant_user may able to
authorized 1 day max even if subscription is expired..
*/
@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
      private readonly context: ContextService,
      private readonly appBroker: AppBrokerService,
      private readonly db: AppRedisService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {}

   async canActivate(context: ExecutionContext) {
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
            const authMerchant = await this.appBroker.request<AppMerchant>({
               basicAuth: true,
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
   }
}
