import { APP_CONFIG, USER } from '@app/constant';
import { EApp, decrypt, getServiceToken, parsePath } from '@app/helper';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { AppConfigService } from 'apps/admin/src/app_config/app_config.service';
import { UserService } from 'shared/shared/user/user.service';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  @Inject(getServiceToken(APP_CONFIG)) private readonly appConfigService: AppConfigService;
  @Inject(getServiceToken(USER)) private readonly userService: UserService;

  async use(request: AppRequest, _, next: () => void) {
    const { data: config } = await this.appConfigService.getConfig({});
    if (!config) throw new ForbiddenException('Config not found');

    request.app = parsePath(request.path)[0] as EApp;
    request.appConfig = config;

    if (request.session.user) {
      const { id } = await decrypt(request.session.user);
      if (!id) throw new BadRequestException("Don't found user");
      request.user = await (
        await this.userService.userWithAuth({ id }, JSON.stringify(request))
      ).data.populate(['merchant']);
      if (!request.user) throw new BadRequestException('User not found');
    }

    next();
  }
}
