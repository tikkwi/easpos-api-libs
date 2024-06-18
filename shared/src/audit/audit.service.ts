import { LOG_TRAIL } from '@common/constant/context.constant';
import { ContextService } from '@common/core';
import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator';
import { AuditServiceMethods } from '@shared/dto';
import { Audit, AuditSchema } from './audit.schema';

@AppService()
export class AuditService extends CoreService<Audit> implements AuditServiceMethods {
  private readonly contextService: ContextService;
  constructor() {
    super(Audit.name, AuditSchema);
  }

  async logRequest(request: AppRequest) {
    return await this.repository.create({
      submittedIP: request.ip,
      sessionId: request.sessionID,
      userAgent: request.headers['user-agent'] as any,
      logTrail: this.contextService.get(LOG_TRAIL),
      user: {
        type: request.user.type,
        email: request.user.mail,
        name: `${request.user.firstName} ${request.user.lastName}`,
        user: request.user._id,
      },
    });
  }
}
