import { AppController } from '@common/decorator/app_controller.decorator';
import { AuditService } from './audit.service';
import { CoreController } from '@common/core/core.controller';
import { EAllowedUser } from '@common/utils/enum';

@AppController('audit', [EAllowedUser.Admin])
export class AuditController extends CoreController<AuditService> {}
