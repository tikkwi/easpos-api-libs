import { AppController } from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { AuditService } from '@shared/audit/audit.service';

@AppController('audit', [EAllowedUser.Admin])
export class AuditController {
   constructor(private readonly service: AuditService) {}
}
