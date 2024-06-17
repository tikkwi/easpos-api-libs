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
import { Request } from 'express';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  @Inject(getServiceToken(APP_CONFIG))
  private readonly appConfigService: AppConfigSharedServiceMethods;
  @Inject(getServiceToken(USER))
  private readonly userService: UserSharedServiceMethods;

  async use(request: Request, _, next: () => void) {
    const { data: config } = await this.appConfigService.getConfig({});
    if (!config) throw new ForbiddenException('Config not found');

    request.app = parsePath(request.path)[0] as EApp;
    request.appConfig = config;

    if (request.session.user) {
      const { id } = await decrypt(request.session.user);
      if (!id) throw new BadRequestException("Don't found user");
      request.user = await this.userService.userWithAuth({ id });
      if (!request.user) throw new BadRequestException('User not found');
    }

    next();
  }
}
