import {
  C_APP,
  C_IS_SUB_ACTIVE,
  C_MERCHANT,
  C_REQ,
  C_RES,
  C_USER,
  MERCHANT,
} from '@common/constant';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { ContextService } from '@common/core/context/context.service';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { decrypt } from '@common/utils/encrypt';
import { EApp } from '@common/utils/enum';
import { getServiceToken } from '@common/utils/misc';
import { parsePath } from '@common/utils/regex';
import { Inject, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  constructor(
    @Inject(getServiceToken(MERCHANT)) private readonly merchantService,
    private readonly appBroker: AppBrokerService,
    private readonly context: ContextService,
  ) {}

  async use(request: Request, response: Response, next: () => void) {
    const [app]: any = parsePath(request.originalUrl);

    if (request.session.user) {
      const { user } = await decrypt(request.session.user);
      const { isSubActive, merchant } = await this.appBroker.request(
        (meta) => this.merchantService.merchantWithAuth({ id: user.id }, meta),
        true,
        EApp.Admin,
      );

      this.context.set({
        [C_USER]: user,
        [C_IS_SUB_ACTIVE]: isSubActive,
        [C_MERCHANT]: merchant,
      });

      const sessNearExp = dayjs(request.session.cookie.expires)
        .subtract(12, 'hours')
        .isBefore(dayjs());
      if (sessNearExp)
        request.session.regenerate((err) => {
          throw new InternalServerErrorException(err);
        });
    }

    this.context.set({
      [C_APP]: app,
      [C_REQ]: request,
      [C_RES]: response,
    });

    next();
  }
}
