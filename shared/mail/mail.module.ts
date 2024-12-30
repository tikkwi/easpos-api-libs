import { Module } from '@nestjs/common';
import { MailSchema } from './mail.schema';
import MailService from './mail.service';
import { SCHEMA } from '@common/constant';

@Module({
   providers: [MailService, { provide: SCHEMA, useValue: MailSchema }],
   exports: [MailService],
})
export default class MailModule {}
