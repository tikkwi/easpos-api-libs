import {
   CanActivate,
   ExecutionContext,
   Injectable,
   InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { v4 } from 'uuid';
import { decrypt } from '@common/utils/encrypt';
import { isPeriodExceed } from '@common/utils/datetime';
import ContextService from '../core/context';
import { ServerUnaryCall } from '@grpc/grpc-js';

@Injectable()
export default class TransformGuard implements CanActivate {
   async canActivate(context: ExecutionContext) {
      const id = v4();
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
            data: {
               ip: request.ip,
               userAgent: request.headers['user-agent'],
               isHttp: true,
               request,
               response,
               user,
            },
            id,
         });
      } else {
         const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
         const meta = ctx.metadata.getMap();
         // const meta: Metadata = context.switchToRpc().getContext();
         ContextService.set({
            data: {
               ip: ctx.getPath(),
               userAgent: meta['user-agent'] as string,
               requestedApp: meta['app'] as string,
            },
            id,
         });
      }

      return true;
   }
}
