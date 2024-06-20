import { ContextService, TransactionService } from '@common/core';

export abstract class CoreController {
  protected readonly context: ContextService;
  protected readonly transaction: TransactionService;
  protected service;
  constructor(service) {
    this.service = service;
  }
}
