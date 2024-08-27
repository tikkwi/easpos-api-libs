import { MailService } from '@common/service/mail/mail.service';

export abstract class MailController {
   protected abstract service: MailService;
}
