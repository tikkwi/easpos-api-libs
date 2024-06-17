import { AppController } from '@common/decorator';
import { MailService } from './mail.service';
import { EAllowedUser } from '@common/utils';

@AppController('mail', [EAllowedUser.Admin])
export class MailController {
  constructor(private readonly service: MailService) {}
}
