import { ContextService } from '@common/core/context/context.service';
import { TransactionService } from '@common/core/transaction/transaction.service';
import { GrpcObject } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GrpcOptions } from '@nestjs/microservices';
import { Observable, from, lastValueFrom, tap } from 'rxjs';

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
      return next.handle();
    };

    return action().pipe(tap(() => this.context.reset()));
  }
}
