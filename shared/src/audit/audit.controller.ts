import { AppController } from '@common/decorator/app_controller.decorator';
import { AuditService } from './audit.service';
import { EAllowedUser } from '@common/utils/enum';

@AppController('audit', [EAllowedUser.Admin])
export class AuditController {
  constructor(private readonly service: AuditService) {}
}
