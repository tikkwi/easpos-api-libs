import { REPOSITORY } from '@common/constant';
import { Inject } from '@nestjs/common';
import { ContextService } from '@common/core/context/context.service';
import { TransactionService } from '@common/core/transaction/transaction.service';
import { Repository } from './repository';

export abstract class CoreService<T> {
  @Inject(REPOSITORY) protected repository: Repository<T>;
  protected readonly transaction: TransactionService;
  protected readonly context: ContextService;
}
