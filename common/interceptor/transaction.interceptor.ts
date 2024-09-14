import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import ContextService from '../core/context.service';
import { encrypt } from '../utils/encrypt';

@Injectable()
export default class TransactionInterceptor implements NestInterceptor {
   intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
   ): Observable<any> | Promise<Observable<any>> {
      return ContextService.get('d_connection')
         .startSession()
         .then((session) => {
            session.startTransaction();
            ContextService.set({ session });
            return next.handle().pipe(
               map(({ data, ...res }) => {
                  // ContextService.get('d_auditService').logRequest();
                  if (context.getType() === 'http') return { data, ...res };
                  return { data: encrypt(JSON.stringify(data)), ...res };
               }),
               tap(() => ContextService.reset()),
            );
         });
   }
}
