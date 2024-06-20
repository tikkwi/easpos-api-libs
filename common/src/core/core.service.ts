import { ContextService, Repository, TransactionService } from '@common/core';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export abstract class CoreService<T = unknown> {
  @InjectConnection() protected readonly connection: Connection;
  protected readonly transaction: TransactionService;
  protected readonly context: ContextService;
  protected repository: Repository<T>;

  constructor(name?: string, schema?: any) {
    this.repository = new Repository(this.connection.model(name, schema));
  }
}
