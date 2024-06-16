import { CoreService } from '@app/core/core.service';
import { AppService } from '@app/decorator';
import { EApp } from '@app/helper';
import { MailServiceMethods, SendMailDto } from '@app/types';

@AppService()
export class MailService extends CoreService implements MailServiceMethods {
  constructor() {
    super(EApp.Admin);
  }

  async sendMail({ mail, type }: SendMailDto) {
    console.log(`Send ${type} to ${mail}`);
  }
}
