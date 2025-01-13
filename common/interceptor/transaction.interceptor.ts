import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export default class TransactionInterceptor implements NestInterceptor {
   constructor() {}

   intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
   ): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
         map((res) => {
            // auditService.logRequest();
            return res;
         }),
      );
   }
}
