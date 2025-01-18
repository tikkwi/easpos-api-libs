import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export default class TransactionInterceptor implements NestInterceptor {
   constructor() {}

   intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
   ): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
         map(async (res) => {
            const { session }: RequestContext =
               context.getType() === 'http'
                  ? context.switchToHttp().getRequest<Request>().ctx
                  : (context.switchToRpc() as any).args[2].request.ctx;
            // auditService.logRequest();
            await session.commitTransaction();
            await session.endSession();
            return res;
         }),
      );
   }
}
