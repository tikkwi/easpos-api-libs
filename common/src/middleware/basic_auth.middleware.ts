import { C_APP, C_BASIC_AUTH } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private readonly context: ContextService) {}

  async use(request: Request, response: Response, next: () => void) {
    const basicAuth = this.context.get(C_BASIC_AUTH);
    if (!basicAuth) throw new InternalServerErrorException('No Auth Cred');

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic'))
      response
        .status(401)
        .setHeader('WWW-Authenticate', `Basic realm=${this.context.get(C_APP)}`)
        .send('Authentication Required...');

    const [usr, pass] = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString('ascii')
      .split(':');
    if (basicAuth.userName === usr && (await compare(pass, basicAuth.password)))
      next();
    else throw new ForbiddenException('Incorrect username or password');
  }
}
