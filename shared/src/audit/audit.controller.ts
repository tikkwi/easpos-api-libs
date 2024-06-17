import { AppController } from '@common/decorator';
import { AuditService } from './audit.service';
import { EAllowedUser } from '@common/utils';

@AppController('admin-api/audit', [EAllowedUser.Admin])
export class AuditController {
  constructor(private readonly service: AuditService) {}
}
