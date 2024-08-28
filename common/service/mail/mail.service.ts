import { SendMailDto } from '@common/dto/global/mail.dto';
import { CoreService } from '@common/core/service/core.service';
import { Mail } from '@common/schema/mail.schema';

export abstract class MailService extends CoreService<Mail> {
   w;

   async sendMail({ mail, type }: SendMailDto) {
      console.log(`Send ${type} to ${mail}`);
   }
}
