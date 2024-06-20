import { C_APP, C_BASIC_AUTH } from '@common/constant';
import { ContextService } from '@common/core';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { Request, Response } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  private readonly context: ContextService;

  async use(request: Request, response: Response, next: () => void) {
    let isValid = true;
    const { userName, password } = this.context.get(C_BASIC_AUTH);
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
        .setHeader('WWW-Authenticate', `Basic realm=${this.context.get(C_APP)}`)
        .send('Authentication Required...');
    next();
  }
}
