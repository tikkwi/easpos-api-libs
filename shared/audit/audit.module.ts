import { Module } from '@nestjs/common';
import { AuditSchema } from './audit.schema';
import AuditService from './audit.service';
import { SCHEMA } from '@common/constant';

@Module({
   providers: [AuditService, { provide: SCHEMA, useValue: AuditSchema }],
   exports: [AuditService],
})
export default class AuditModule {}
