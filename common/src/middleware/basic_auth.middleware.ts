import { AUTH_CREDENTIAL } from '@app/constant';
import { getServiceToken, parsePath } from '@app/helper';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { AuthCredentialService } from 'apps/admin/src/auth_credential/auth_credential.service';
import { compare } from 'bcryptjs';
import { Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  @Inject(getServiceToken(AUTH_CREDENTIAL))
  private readonly credentialService: AuthCredentialService;

  async use(request: Request, response: Response, next: () => void) {
    let isValid = true;
    const [app, service] = parsePath(request.path);
    const {
      data: { userName, password },
    } = await this.credentialService.getAuthCredential({ request, type: service as any });
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
