import { C_LOG_TRAIL, C_REQ, C_RES, C_SESSION } from '@common/constant';
import { InjectConnection } from '@nestjs/mongoose';
import { AuditService } from '@shared/audit/audit.service';
import { Connection } from 'mongoose';
import { ContextService } from '@common/core/context/context.service';
import { responseError } from '@common/utils/misc';

export class TransactionService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly context: ContextService,
    private readonly auditService: AuditService,
  ) {}

  async makeTransaction(action: () => Promise<any>) {
    const session = await this.connection.startSession();
    try {
      this.context.set(C_SESSION, session);
      this.context.set(C_LOG_TRAIL, []);
      const res = await action();
      this.auditService.logRequest();
      await session.commitTransaction();
      session.endSession();
      return res;
    } catch (error) {
      session.abortTransaction();
      responseError(this.context.get(C_REQ), this.context.get(C_RES), error);
    }
  }
}
