import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getRepositoryProvider } from '@common/utils/misc';
import Audit, { AuditSchema } from './audit.schema';
import AuditService from './audit.service';

@Module({
   imports: [MongooseModule.forFeature([{ name: Audit.name, schema: AuditSchema }])],
   providers: [AuditService, getRepositoryProvider({ name: Audit.name })],
   exports: [AuditService],
})
export default class AuditModule {}
