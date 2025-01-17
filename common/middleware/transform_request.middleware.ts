import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { decrypt } from '../utils/encrypt';
import AppContext from '../core/app_context.service';
import process from 'node:process';
import { USER_BASIC_AUTH_PATHS } from '../constant';

@Injectable()
export default class TransformRequestMiddleware implements NestMiddleware {
   async use(request: Request, _, next: () => void) {
      let user: AuthUser;
      if (request.session.user) user = await decrypt<AuthUser>(request.session.user);
      const isBasicAuthPath = USER_BASIC_AUTH_PATHS.some(({ path }) =>
         request.originalUrl.includes(path),
      );
      request.ctx = {
         logTrail: [],
         requestedApp: process.env['APP'] as EApp,
         contextType: 'http',
         user,
         ip: request.ip,
         userAgent: request.headers['user-agent'],
      };
      // if (isBasicAuthPath) {
      const [connection, session] = await AppContext.getSession();
      request.ctx.connection = connection;
      request.ctx.session = session;
      // }
      next();
   }
}
