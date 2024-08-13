import { MERCHANT, USERS } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser, EApp, EUser } from '@common/utils/enum';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { APP_MERCHANT } from '@common/constant/app_context.constant';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { getServiceToken } from '@common/utils/misc';
import { parsePath } from '@common/utils/regex';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';

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
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {}

   async canActivate(context: ExecutionContext) {
      const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
      const user = this.context.get('user');
      const request = context.switchToHttp().getRequest();
      const [_, service]: any = parsePath(request.originalUrl);

      if (!allowedUsers.length || allowedUsers.includes(EAllowedUser.Any)) return true;
      if (user) {
         if (
            !user.isOwner &&
            (!user.permissions.hasOwnProperty(service) ||
               !user.permissions[service].includes(request.originalUrl))
         )
            return false;

         if (EUser.Admin && allowedUsers.includes(EUser.Admin)) return true;

         const authMerchant = await this.appBroker.request<AppMerchant>(
            true,
            (meta) => this.merchantService.merchantWithAuth({ id: user.id }, meta),
            APP_MERCHANT,
            EApp.Admin,
         );

         if (!authMerchant.merchant) return false;

         return authMerchant.isSubActive || allowedUsers.includes(EAllowedUser.MerchantNoSub);
      }
      return false;
   }
}
