import { ContextService } from '@core/context/context.service';
import { InjectConnection } from '@nestjs/mongoose';
import { AuditService } from '@shared/audit/audit.service';
import { Connection } from 'mongoose';

export class TransactionService {
   constructor(
      @InjectConnection() private readonly connection: Connection,
      private readonly context: ContextService,
      private readonly auditService: AuditService,
   ) {}

   async makeTransaction(action: () => Promise<any>) {
      const session = await this.connection.startSession();
      try {
         session.startTransaction();
         this.context.set({ session: session });
         const res = await action();
         // this.auditService.logRequest();
         await session.commitTransaction();
         session.endSession();
         return res;
      } catch (error) {
         session.abortTransaction();
         session.endSession();
         throw new Error(error);
      }
   }
}
