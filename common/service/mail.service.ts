import { SendMailDto } from '@common/dto/global/mail.dto';
import { CoreService } from '@common/core/core.service';
import { Mail } from '@common/schema/mail.schema';

export abstract class MailService<T extends Mail = Mail> extends CoreService<T> {
   async sendMail({ mail, type }: SendMailDto) {
      console.log(`Send ${type} to ${mail}`);
   }
}
