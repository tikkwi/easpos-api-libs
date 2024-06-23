import { USERS } from '@common/constant';
import { AllowedUser } from '@common/dto/core.dto';
import { EAllowedUser } from '@common/utils/enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const httpCtx = context.switchToHttp();
    const request: AppRequest = httpCtx.getRequest();
    const allowedUsers = this.reflector.get<AllowedUser[]>(USERS, context.getHandler());
    const merchantUsers = [EAllowedUser.Owner, EAllowedUser.Merchant, EAllowedUser.MerchantNoSub];

    const userType =
      merchantUsers.includes(request.user?.type as any) && !request.isSubActive
        ? EAllowedUser.MerchantNoSub
        : request.user?.isOwner
          ? EAllowedUser.Owner
          : request.user?.type;

    if (
      allowedUsers?.length &&
      (!request.user ||
        !allowedUsers.includes(userType) ||
        (intersection(allowedUsers, merchantUsers).length &&
          (!request.user.merchant ||
            (!allowedUsers.includes(EAllowedUser.MerchantNoSub) && !request.isSubActive))))
    )
      return false;
    return true;
  }
}
