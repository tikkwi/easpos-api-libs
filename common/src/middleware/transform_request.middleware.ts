import { ADMIN_APP, C_APP, C_BASIC_AUTH, C_REQ, C_RES } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { getServiceToken } from '@common/utils/misc';
import { parsePath } from '@common/utils/regex';
import { Inject, Injectable, NestMiddleware, OnModuleInit } from '@nestjs/common';
import { Response } from 'express';
import { AdminAppService } from 'src/admin_app/admin_app.service';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  constructor(
    @Inject(getServiceToken(ADMIN_APP)) private readonly adminAppService: AdminAppService,
    private readonly context: ContextService,
  ) {}

  async use(request: AppRequest, response: Response, next: () => void) {
    const [app]: any = parsePath(request.originalUrl);
    const { config, isSubActive, merchant, user, basicAuth } =
      await this.adminAppService.getAuthData({ request });
    // request.app = app;
    // request.user = user;
    // request.merchant = merchant;
    // request.appConfig = config;
    // request.isSubActive = isSubActive;
    this.context.set(C_BASIC_AUTH, basicAuth);
    this.context.set(C_APP, app);
    this.context.set(C_REQ, request);
    this.context.set(C_RES, response);

    next();
  }
}
