import { USERS } from '@common/constant';
import { AllowedUser } from '@common/decorator';
import { EAllowedUser } from '@common/utils';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { intersection } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly reflector: Reflector;

  async canActivate(context: ExecutionContext) {
    const httpCtx = context.switchToHttp();
    const request: Request = httpCtx.getRequest();
    const allowedUsers = this.reflector.get<AllowedUser[]>(
      USERS,
      context.getHandler(),
    );
    const merchantUsers = [
      EAllowedUser.Owner,
      EAllowedUser.Merchant,
      EAllowedUser.MerchantNoSub,
    ];
    const userType =
      merchantUsers.includes(request.user.type as any) && !request.isSubActive
        ? EAllowedUser.MerchantNoSub
        : request.user.isOwner
          ? EAllowedUser.Owner
          : request.user.type;

    if (
      allowedUsers.length &&
      (!request.user ||
        !allowedUsers.includes(userType) ||
        (intersection(allowedUsers, merchantUsers).length &&
          (!request.user.merchant ||
            (!allowedUsers.includes(EAllowedUser.MerchantNoSub) &&
              !request.user.merchant.isSubActive))))
    )
      return false;
    return true;
  }
}
