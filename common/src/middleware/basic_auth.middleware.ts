import { AUTH_CREDENTIAL, C_APP, C_BASIC_AUTH } from '@common/constant';
import { ContextService } from '@common/core';
import { AuthCredentialSharedServiceMethods } from '@common/dto/auth_credential.dto';
import { getServiceToken, parsePath } from '@common/utils';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  private readonly contextService: ContextService;

  async use(request: Request, response: Response, next: () => void) {
    let isValid = true;
    const { userName, password } = this.contextService.get(C_BASIC_AUTH);
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic') || !userName || !password) isValid = false;
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
        .setHeader('WWW-Authenticate', `Basic realm=${this.contextService.get(C_APP)}`)
        .send('Authentication Required...');
    next();
  }
}
