import { C_APP, C_BASIC_AUTH, C_REQ, C_RES } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AdminAppSharedServiceMethods } from '@common/dto/admin_app.dto';
import { parsePath } from '@common/utils/regex';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export abstract class TransformRequestMiddleware implements NestMiddleware {
  private readonly context: ContextService;
  protected abstract adminAppService: AdminAppSharedServiceMethods;

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
