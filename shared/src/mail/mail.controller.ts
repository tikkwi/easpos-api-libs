import { AppController } from '@common/decorator/app_controller.decorator';
import { MailService } from './mail.service';
import { CoreController } from '@common/core/core.controller';
import { EAllowedUser } from '@common/utils/enum';

@AppController('mail', [EAllowedUser.Admin])
export class MailController extends CoreController<MailService> {}
