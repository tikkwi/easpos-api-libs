import { C_LOG_TRAIL, C_SESSION } from '@common/constant';
import { InjectConnection } from '@nestjs/mongoose';
import { AuditService } from '@shared/audit/audit.service';
import { Connection } from 'mongoose';
import { ContextService } from '@common/core/context/context.service';

export class TransactionService {
  @InjectConnection() private readonly connection: Connection;
  private readonly contextService: ContextService;
  private readonly auditService: AuditService;

  async makeTransaction(action: () => Promise<any>) {
    const session = await this.connection.startSession();
    try {
      this.contextService.set(C_SESSION, session);
      this.contextService.set(C_LOG_TRAIL, []);
      const res = await action();
      this.auditService.logRequest();
      await session.commitTransaction();
      session.endSession();
      return res;
    } catch (error) {
      session.abortTransaction();
      throw new Error(error);
    }
  }
}
