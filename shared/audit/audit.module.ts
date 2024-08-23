import { getRepositoryProvider } from '@utils/misc';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditController } from './audit.controller';
import { Audit, AuditSchema } from './audit.schema';
import { AuditService } from './audit.service';

@Module({
   imports: [MongooseModule.forFeature([{ name: Audit.name, schema: AuditSchema }])],
   controllers: [AuditController],
   providers: [AuditService, getRepositoryProvider({ name: Audit.name })],
   exports: [AuditService],
})
export class AuditModule {}
