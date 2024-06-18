import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator';
import { AuditServiceMethods, LogRequestDto } from '@shared/dto';
import { Audit, AuditSchema } from './audit.schema';

@AppService()
export class AuditService extends CoreService<Audit> implements AuditServiceMethods {
  constructor() {
    super(Audit.name, AuditSchema);
  }

  async logRequest(request: AppRequest, logTrail: RequestLog[]) {
    return await this.repository.create({
      submittedIP: request.ip,
      sessionId: request.sessionID,
      userAgent: request.headers['user-agent'] as any,
      logTrail,
      user: {
        type: request.user.type,
        email: request.user.mail,
        name: `${request.user.firstName} ${request.user.lastName}`,
        user: request.user._id,
      },
    });
  }
}
