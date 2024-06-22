import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { AuditModule } from './audit/audit.module';
import { CategoryModule } from './category/category.module';
import { ExceedLimitModule } from './exceed_limit/exceed_limit.module';
import { MailModule } from './mail/mail.module';
import { TmpModule } from './tmp/tmp.module';

@Module({
  imports: [AddressModule, AuditModule, CategoryModule, ExceedLimitModule, MailModule, TmpModule],
})
export class SharedModule {}
