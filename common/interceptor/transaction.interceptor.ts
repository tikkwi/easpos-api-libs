import { ContextService } from '@core/context/context.service';
import { TransactionService } from '@core/transaction/transaction.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { from, lastValueFrom, map, Observable, tap } from 'rxjs';
import { encrypt } from '@utils/encrypt';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
   constructor(
      private readonly transaction: TransactionService,
      private readonly context: ContextService,
   ) {}

   intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
   ): Observable<any> | Promise<Observable<any>> {
      const action = () => {
         if (context.getType() === 'http')
            return from(this.transaction.makeTransaction(() => lastValueFrom(next.handle())));
         return next.handle().pipe(
            map(async ({ data, ...res }) => {
               return { data: encrypt(JSON.stringify(data)), ...res };
            }),
         );
      };

      return action().pipe(tap(() => this.context.reset()));
   }
}
