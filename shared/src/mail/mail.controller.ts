import { AppController } from '@common/decorator';
import { MailService } from './mail.service';
import { EAllowedUser } from '@common/utils';
import { CoreController } from '@common/core/core.controller';

@AppController('mail', [EAllowedUser.Admin])
export class MailController extends CoreController {
  constructor(service: MailService) {
    super(service);
  }
}
