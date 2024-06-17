import { AUTH_CREDENTIAL } from '@common/constant';
import { AuthCredentialSharedServiceMethods } from '@common/dto/auth_credential.dto';
import { getServiceToken, parsePath } from '@common/utils';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  /**
   * NOTE: provide instead of simply importing as this must communicate via grpc 
    if request from user app
  */
  @Inject(getServiceToken(AUTH_CREDENTIAL))
  private readonly credentialService: AuthCredentialSharedServiceMethods;

  async use(request: Request, response: Response, next: () => void) {
    let isValid = true;
    const [app, service] = parsePath(request.path);
    const {
      data: { userName, password },
    } = await this.credentialService.getAuthCredential({
      type: service as any,
    });
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic')) isValid = false;
    if (isValid) {
      const [usr, pass] = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString('ascii')
        .split(':');
      if (userName === usr && (await compare(pass, password))) next();
      else isValid = false;
    }
    if (!isValid)
      response
        .status(401)
        .setHeader('WWW-Authenticate', `Basic realm=${app}`)
        .send('Authentication Required...');
    next();
  }
}
