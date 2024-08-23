import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuditModule } from '@shared/audit/audit.module';

@Module({
   imports: [AuditModule],
   providers: [TransactionService],
   exports: [TransactionService],
})
export class TransactionModule {}
