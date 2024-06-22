import { TransactionService } from '@common/core/transaction/transaction.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, from, lastValueFrom } from 'rxjs';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly transaction: TransactionService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const action = async () => lastValueFrom(next.handle());
    return from(this.transaction.makeTransaction(action));
  }
}
