import { AppController } from '@app/decorator';
import { MailService } from './mail.service';
import { EAllowedUser } from '@app/helper';

@AppController('admin-api/mail', [EAllowedUser.Admin])
export class MailController {
  constructor(private readonly service: MailService) {}
}
