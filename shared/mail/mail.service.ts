import BaseService from '@common/core/base/base.service';
import { SendMailDto } from './mail.dto';
import Mail from './mail.schema';
import AppService from '@common/decorator/app_service.decorator';

@AppService()
export default class MailService extends BaseService<Mail> {
   async sendMail({ mail, type }: SendMailDto) {
      console.log(`Send ${type} to ${mail}`);
   }
}
