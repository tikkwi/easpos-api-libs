import { USERS } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser, EUser } from '@common/utils/enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
      private readonly context: ContextService,
   ) {}

   async canActivate(context: ExecutionContext) {
      const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
      const merchantUsers = [EAllowedUser.Owner, EAllowedUser.Merchant, EAllowedUser.MerchantNoSub];
      const user = this.context.get('user');

      if (allowedUsers.length) {
         if (this.context.get('user')) {
            const merchant = this.context.get('merchant');
            const isSubActive = this.context.get('isSubActive');
            if (!merchant) return false;

            if (user.isOwner || user.type === EUser.Merchant) {
               const allowedMerchant = intersection(allowedUsers, merchantUsers);
               if (allowedMerchant.length) {
                  if (isSubActive) {
                     if (user.isOwner) return true;
                     return !!intersection(allowedMerchant, [
                        EAllowedUser.Merchant,
                        EAllowedUser.MerchantNoSub,
                     ]).length;
                  }
                  return allowedMerchant.includes(EAllowedUser.MerchantNoSub);
               }
               return false;
            }
            return allowedUsers.includes(user.type);
         }
         return false;
      }

      return true;
   }
}
