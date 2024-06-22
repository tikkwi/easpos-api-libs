import { AppService } from '@common/decorator/app_service.decorator';
import { MailServiceMethods, SendMailDto } from '@shared/mail/mail.dto';

@AppService()
export class MailService implements MailServiceMethods {
  async sendMail({ mail, type }: SendMailDto) {
    console.log(`Send ${type} to ${mail}`);
  }
}
