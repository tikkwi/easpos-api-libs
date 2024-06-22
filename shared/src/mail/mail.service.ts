import { Injectable } from '@nestjs/common';
import { MailServiceMethods, SendMailDto } from '@shared/mail/mail.dto';

@Injectable()
export class MailService implements MailServiceMethods {
  async sendMail({ mail, type }: SendMailDto) {
    console.log(`Send ${type} to ${mail}`);
  }
}
