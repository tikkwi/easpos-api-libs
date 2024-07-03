import { AUTH_CREDENTIAL, C_APP } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AuthCredentialSharedServiceMethods } from '@common/dto/auth_credential.dto';
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
    @Inject(getServiceToken(AUTH_CREDENTIAL))
    private readonly credService: AuthCredentialSharedServiceMethods,
    private readonly context: ContextService,
  ) {}

  async use(request: Request, response: Response, next: () => void) {
    const {
      data: { userName, password },
    } = await this.credService.getAuthCredential({ url: request.originalUrl });
    if (!userName) throw new InternalServerErrorException('No Auth Cred');

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic'))
      response
        .status(401)
        .setHeader('WWW-Authenticate', `Basic realm=${this.context.get(C_APP)}`)
        .send('Authentication Required...');

    if (await authenticateBasicAuth({ userName, password }, request.headers.authorization)) next();
    else throw new ForbiddenException('Incorrect username or password');
  }
}
