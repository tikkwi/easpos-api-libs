import { ADMIN_APP, C_APP, C_BASIC_AUTH, C_REQ, C_RES } from '@common/constant';
import { ContextService } from '@common/core';
import { AdminAppSharedServiceMethods } from '@common/dto/admin_app.dto';
import { getServiceToken, parsePath } from '@common/utils';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  /**
   * NOTE: provide instead of simply importing as this must communicate via grpc 
    if request from user app
  */
  private readonly context: ContextService;
  @Inject(getServiceToken(ADMIN_APP))
  private readonly adminAppService: AdminAppSharedServiceMethods;

  async use(request: AppRequest, response: Response, next: () => void) {
    const [app]: any = parsePath(request.path);
    const { config, isSubActive, merchant, user, basicAuth } =
      await this.adminAppService.getAuthData({
        request,
        newTransaction: true,
      });
    request.app = app;
    request.user = user;
    request.merchant = merchant;
    request.appConfig = config;
    request.isSubActive = isSubActive;
    this.context.set(C_BASIC_AUTH, basicAuth);
    this.context.set(C_APP, app);
    this.context.set(C_REQ, request);
    this.context.set(C_RES, response);

    next();
  }
}
