import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { encrypt } from '../utils/encrypt';

@Injectable()
export default class TransactionInterceptor implements NestInterceptor {
   constructor() {}

   intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
   ): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
         map(({ data, ...res }) => {
            // auditService.logRequest();
            if (context.getType() === 'http') return { data, ...res };
            return { data: encrypt(JSON.stringify(data)), ...res };
         }),
      );
   }
}
