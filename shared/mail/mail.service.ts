import CoreService from '@common/core/core.service';
import { SendMailDto } from './mail.dto';
import Mail from './mail.schema';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import AppService from '@common/decorator/app_service.decorator';

@AppService()
export default class MailService extends CoreService<Mail> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Mail>) {
      super();
   }

   async sendMail({ mail, type }: SendMailDto) {
      console.log(`Send ${type} to ${mail}`);
   }
}
