import { AUTH_CREDENTIAL } from '@common/constant';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { ContextService } from '@common/core/context/context.service';
import { EApp } from '@common/utils/enum';
import { authenticateBasicAuth, getServiceToken } from '@common/utils/misc';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(getServiceToken(AUTH_CREDENTIAL)) private readonly credService,
    private readonly appBroker: AppBrokerService,
    private readonly context: ContextService,
  ) {}

  async use(request: Request, response: Response, next: () => void) {
    const { userName, password } = await this.appBroker.request(
      (meta) => this.credService.getAuthCredential({ url: request.originalUrl }, meta),
      true,
      EApp.Admin,
    );

    if (!userName) throw new InternalServerErrorException('No Auth Cred');

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic'))
      response
        .status(401)
        .setHeader('WWW-Authenticate', `Basic realm=${this.context.get('app')}`)
        .send('Authentication Required...');

    if (await authenticateBasicAuth({ userName, password }, request.headers.authorization)) next();
    else throw new ForbiddenException('Incorrect username or password');
  }
}
