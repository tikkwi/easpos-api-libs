import { ContextService } from '@common/core/context/context.service';
import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator/app_service.decorator';
import { MailServiceMethods, SendMailDto } from '@shared/mail/mail.dto';

@AppService()
export class MailService extends CoreService implements MailServiceMethods {
   constructor(protected readonly context: ContextService) {
      super();
   }

   async sendMail({ mail, type }: SendMailDto) {
      console.log(`Send ${type} to ${mail}`);
   }
}
