import { AppService } from '@common/decorator';
import { CoreService } from '@common/core/core.service';
import { AuditServiceMethods, LogRequestDto } from '@shared/dto';
import { Request } from 'express';
import { Audit, AuditSchema } from './audit.schema';

@AppService()
export class AuditService
  extends CoreService<Audit>
  implements AuditServiceMethods
{
  constructor() {
    super(Audit.name, AuditSchema);
  }

  async logRequest(request: Request, dto: LogRequestDto) {
    return await this.repository.create({
      submittedIP: request.ip,
      sessionId: request.sessionID,
      userAgent: request.headers['user-agent'] as any,
      logTrail: request.logTrail,
      ...dto,
    });
  }
}
