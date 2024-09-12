import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Mail, { MailSchema } from './mail.schema';
import MailService from './mail.service';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
   imports: [MongooseModule.forFeature([{ name: Mail.name, schema: MailSchema }])],
   providers: [MailService, getRepositoryProvider({ name: Mail.name })],
   exports: [MailService],
})
export default class MailModule {}
