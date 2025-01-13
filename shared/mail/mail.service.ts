import BaseService from '@common/core/base/base.service';
import { SendMailDto } from './mail.dto';
import Mail from './mail.schema';
import AppService from '@common/decorator/app_service.decorator';
import { ModuleRef } from '@nestjs/core';

@AppService()
export default class MailService extends BaseService<Mail> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }

   async sendMail({ mail, type }: SendMailDto) {
      console.log(`Send ${type} to ${mail}`);
   }
}
