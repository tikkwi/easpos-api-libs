import { MailServiceMethods, SendMailDto } from '@shared/mail/mail.dto';
import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';

@AppService()
export class MailService extends CoreService implements MailServiceMethods {
   constructor(protected readonly context: ContextService) {
      super();
   }

   async sendMail({ mail, type }: SendMailDto) {
      console.log(`Send ${type} to ${mail}`);
   }
}
