import { C_IS_SUB_ACTIVE, C_USER, USERS } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AllowedUser } from '@common/dto/core.dto';
import { AuthUser } from '@common/dto/entity.dto';
import { EAllowedUser } from '@common/utils/enum';
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
    const user = this.context.get<AuthUser>(C_USER);
    const isSubActive = this.context.get<boolean>(C_IS_SUB_ACTIVE);

    const userType =
      merchantUsers.includes(user?.type as any) && !isSubActive
        ? EAllowedUser.MerchantNoSub
        : user?.isOwner
          ? EAllowedUser.Owner
          : user?.type;

    if (
      allowedUsers?.length &&
      (!user ||
        !allowedUsers.includes(userType) ||
        (intersection(allowedUsers, merchantUsers).length &&
          (!user.merchant || (!allowedUsers.includes(EAllowedUser.MerchantNoSub) && !isSubActive))))
    )
      return false;
    return true;
  }
}
