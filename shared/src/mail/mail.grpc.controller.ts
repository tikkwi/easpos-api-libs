import { GrpcHandler } from '@app/decorator';
import { SendMailDto } from './mail.dto';
import { MailService } from './mail.service';

@GrpcHandler()
export class MailGrpcController {
  constructor(private readonly service: MailService) {}

  async sendMail(dto: SendMailDto) {
    return this.service.sendMail(dto);
  }
}
