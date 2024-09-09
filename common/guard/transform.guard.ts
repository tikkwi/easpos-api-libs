import { ServerUnaryCall } from '@grpc/grpc-js';
import {
   CanActivate,
   ExecutionContext,
   Injectable,
   InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { decrypt } from '@common/utils/encrypt';
import { isPeriodExceed } from '@common/utils/datetime';
import { ContextService } from '@common/core/context.service';

@Injectable()
export class TransformGuard implements CanActivate {
   async canActivate(context: ExecutionContext) {
      if (context.getType() === 'http') {
         const ctx = context.switchToHttp();
         const request: Request = ctx.getRequest();
         const response = ctx.getResponse();

         let user;
         if (request.session.user) {
            ({ user } = await decrypt<any>(request.session.user));

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

         ContextService.set({
            ip: request.ip,
            userAgent: request.headers['user-agent'],
            isHttp: true,
            request,
            response,
            user,
         });
      } else {
         const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         const meta = ctx.metadata.getMap();
         ContextService.set({
            ip: ctx.getPath(),
            userAgent: meta['user-agent'],
            requestedApp: meta.app,
         });
      }

      return true;
   }
}
