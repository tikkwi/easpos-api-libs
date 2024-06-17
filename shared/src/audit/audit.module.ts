import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
//import { getRepositoryProviders } from '@app/helper';
import { Audit, AuditSchema } from '@app/schema';

@Module({
  imports: [],
  controllers: [AuditController],
  providers: [
    AuditService,
    // ...getRepositoryProviders([{ name: Audit.name, schema: AuditSchema }])
  ],
})
export class AuditModule {}
