import {
  ADMIN_APP,
  C_APP,
  C_APP_CONFIG,
  C_BASIC_AUTH,
  C_IS_SUB_ACTIVE,
  C_MERCHANT,
  C_REQ,
  C_RES,
  C_USER,
} from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { decrypt } from '@common/utils/encrypt';
import { getServiceToken } from '@common/utils/misc';
import { parsePath } from '@common/utils/regex';
import { ForbiddenException, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminAppService } from 'src/admin_app/admin_app.service';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  constructor(
    @Inject(getServiceToken(ADMIN_APP)) private readonly adminAppService: AdminAppService,
    private readonly context: ContextService,
  ) {}

  async use(request: Request, response: Response, next: () => void) {
    const [app]: any = parsePath(request.originalUrl);
    let id;

    if (request.session.user) {
      ({ id } = await decrypt(request.session.user));
      if (!id) throw new ForbiddenException();
    }

    const { config, isSubActive, merchant, user, basicAuth } =
      await this.adminAppService.getAuthData({ url: request.originalUrl, id });

    this.context.set({
      [C_APP]: app,
      [C_USER]: user,
      [C_MERCHANT]: merchant,
      [C_APP_CONFIG]: config,
      [C_IS_SUB_ACTIVE]: isSubActive,
      [C_BASIC_AUTH]: basicAuth,
      [C_REQ]: request,
      [C_RES]: response,
    });

    next();
  }
}
