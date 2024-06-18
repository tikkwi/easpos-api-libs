import { ADMIN_APP, C_APP, C_BASIC_AUTH } from '@common/constant';
import { ContextService } from '@common/core';
import { AdminAppSharedServiceMethods } from '@common/dto/admin_app.dto';
import { getServiceToken, parsePath } from '@common/utils';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  /**
   * NOTE: provide instead of simply importing as this must communicate via grpc 
    if request from user app
  */
  private readonly contextService: ContextService;
  @Inject(getServiceToken(ADMIN_APP))
  private readonly adminAppService: AdminAppSharedServiceMethods;

  async use(request: AppRequest, _, next: () => void) {
    const [app] = parsePath(request.path);
    const { config, isSubActive, merchant, user, basicAuth } =
      await this.adminAppService.getAuthData({
        request,
        newTransaction: true,
      });
    request.user = user;
    request.merchant = merchant;
    request.appConfig = config;
    request.isSubActive = isSubActive;
    this.contextService.set(C_BASIC_AUTH, basicAuth);
    this.contextService.set(C_APP, app);

    next();
  }
}
