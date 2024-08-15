import { ContextService } from '@common/core/context/context.service';
import { decrypt } from '@common/utils/encrypt';
import { parsePath } from '@common/utils/regex';
import { ServerUnaryCall } from '@grpc/grpc-js';
import {
   CanActivate,
   ExecutionContext,
   Injectable,
   InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { isPeriodExceed } from '@common/utils/datetime';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';

@Injectable()
export class TransformGuard implements CanActivate {
   constructor(
      private readonly context: ContextService,
      private readonly db: AppRedisService,
   ) {}

   async canActivate(context: ExecutionContext) {
      if (context.getType() === 'http') {
         const ctx = context.switchToHttp();
         const request: Request = ctx.getRequest();
         const response = ctx.getResponse();
         const [app]: any = parsePath(request.originalUrl);

         let user;
         if (request.session.user) {
            ({ user } = await decrypt(request.session.user));

            const isExpireSoon = isPeriodExceed(
               request.session.cookie.expires,
               undefined,
               12,
               'hours',
            )[2];

            if (isExpireSoon)
               request.session.regenerate((err) => {
                  throw new InternalServerErrorException(err);
               });
         }

         this.context.set({
            ip: request.ip,
            userAgent: request.headers['user-agent'],
            isHttp: true,
            request,
            response,
            app,
            user,
         });
      } else {
         const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         const meta = ctx.metadata.getMap();
         this.context.set({
            ip: ctx.getPath(),
            userAgent: meta['user-agent'],
            requestedApp: meta.app,
         });
      }

      return true;
   }
}
