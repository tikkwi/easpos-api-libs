import { APP_CONFIG, USER } from '@common/constant';
import {
  AppConfigSharedServiceMethods,
  UserSharedServiceMethods,
} from '@common/dto';
import { decrypt, getServiceToken, parsePath } from '@common/utils';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  /**
   * NOTE: provide instead of simply importing as this must communicate via grpc 
    if request from user app
  */
  @Inject(getServiceToken(APP_CONFIG))
  private readonly appConfigService: AppConfigSharedServiceMethods;
  @Inject(getServiceToken(USER))
  private readonly userService: UserSharedServiceMethods;

  async use(request: AppRequest, _, next: () => void) {
    const { data: config } = await this.appConfigService.getConfig(
      { request },
      { newTransaction: true },
    );
    if (!config) throw new ForbiddenException('Config not found');
    request.appConfig = config;

    if (request.session.user) {
      const { id } = await decrypt(request.session.user);
      if (!id) throw new BadRequestException("Don't found user");
      request.user = await this.userService.userWithAuth(
        { id, request },
        { newTransaction: true },
      );
      if (!request.user) throw new BadRequestException('User not found');
    }

    next();
  }
}
