import { C_LOG_TRAIL, C_SESSION } from '@common/constant';
import { ContextService, Repository } from '@common/core';
import { InjectConnection } from '@nestjs/mongoose';
import { AuditService } from '@shared/audit/audit.service';
import { Connection } from 'mongoose';

export abstract class CoreService<T = unknown> {
  @InjectConnection() private readonly connection: Connection;
  private readonly contextService: ContextService;
  private readonly auditService: AuditService;
  protected repository: Repository<T>;

  constructor(name?: string, schema?: any) {
    this.repository = new Repository(this.connection.model(name, schema));
  }

  async makeTransaction({ request, action, response }: MakeTransactionType) {
    const session = await this.connection.startSession();
    try {
      this.contextService.set(C_SESSION, session);
      this.contextService.set(C_LOG_TRAIL, []);
      const res = await action();
      this.auditService.logRequest(request);
      await session.commitTransaction();
      if (response) response.send(res);
      session.endSession();
    } catch (error) {
      session.abortTransaction();
      throw new Error(error);
    }
  }
}
