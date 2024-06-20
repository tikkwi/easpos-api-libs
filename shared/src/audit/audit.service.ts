import { C_LOG_TRAIL, C_REQ } from '@common/constant';
import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator';
import { AuditServiceMethods } from '@shared/dto';
import { Audit, AuditSchema } from './audit.schema';

@AppService()
export class AuditService extends CoreService<Audit> implements AuditServiceMethods {
  constructor() {
    super(Audit.name, AuditSchema);
  }

  async logRequest() {
    const request: AppRequest = this.context.get(C_REQ);
    return await this.repository.create({
      submittedIP: request.ip,
      sessionId: request.sessionID,
      userAgent: request.headers['user-agent'] as any,
      logTrail: this.context.get(C_LOG_TRAIL),
      user: {
        type: request.user.type,
        email: request.user.mail,
        name: `${request.user.firstName} ${request.user.lastName}`,
        user: request.user._id,
      },
    });
  }
}
