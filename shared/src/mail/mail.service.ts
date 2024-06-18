import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator';
import { MailServiceMethods, SendMailDto } from '@shared/dto';

@AppService()
export class MailService extends CoreService implements MailServiceMethods {
  async sendMail({ mail, type }: SendMailDto, _) {
    console.log(`Send ${type} to ${mail}`);
  }
}
