import { MERCHANT, USERS } from '@common/constant';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { ContextService } from '@common/core/context/context.service';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser, EApp, EUser } from '@common/utils/enum';
import { getServiceToken } from '@common/utils/misc';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(getServiceToken(MERCHANT)) private readonly merchantService,
    private readonly appBroker: AppBrokerService,
    private readonly reflector: Reflector,
    private readonly context: ContextService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
    const merchantUsers = [EAllowedUser.Owner, EAllowedUser.Merchant, EAllowedUser.MerchantNoSub];
    const user = this.context.get('user');

    if (allowedUsers.length) {
      if (this.context.get('user')) {
        const { isSubActive, merchant } = await this.appBroker.request(
          (meta) => this.merchantService.merchantWithAuth({ id: user.id }, meta),
          true,
          EApp.Admin,
        );
        this.context.set({ merchant });
        if (user.isOwner || user.type === EUser.Merchant) {
          const allowedMerchant = intersection(allowedUsers, merchantUsers);
          if (allowedMerchant.length) {
            if (isSubActive) {
              if (user.isOwner) return true;
              if (
                intersection(allowedMerchant, [EAllowedUser.Merchant, EAllowedUser.MerchantNoSub])
                  .length
              )
                return true;
              return false;
            }
            if (allowedMerchant.includes(EAllowedUser.MerchantNoSub)) return true;
            return false;
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
