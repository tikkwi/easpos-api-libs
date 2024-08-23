import { AppController } from '@decorator/app_controller.decorator';
import { MailService } from './mail.service';
import { EAllowedUser } from '@utils/enum';

@AppController('mail', [EAllowedUser.Admin])
export class MailController {
   constructor(private readonly service: MailService) {}
}
