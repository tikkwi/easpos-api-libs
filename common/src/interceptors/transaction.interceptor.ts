import { ContextService } from '@common/core/context/context.service';
import { TransactionService } from '@common/core/transaction/transaction.service';
import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, from, lastValueFrom, tap } from 'rxjs';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly transaction: TransactionService,
    private readonly context: ContextService,
  ) {}

  intercept(_, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const action = async () => lastValueFrom(next.handle());
    return from(this.transaction.makeTransaction(action)).pipe(tap(() => this.context.reset()));
  }
}
