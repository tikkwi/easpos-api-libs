import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { from, lastValueFrom, map, Observable, tap } from 'rxjs';
import { TransactionService } from '@common/core/transaction/transaction.service';
import { ContextService } from '@common/core/context/context.service';
import { encrypt } from '@common/utils/encrypt';

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
