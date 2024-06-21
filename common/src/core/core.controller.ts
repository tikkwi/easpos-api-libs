import { ContextService } from '@common/core/context/context.service';
import { TransactionService } from '@common/core/transaction/transaction.service';

export abstract class CoreController<T> {
  protected readonly context: ContextService;
  protected readonly transaction: TransactionService;
  protected readonly service: T;
}
