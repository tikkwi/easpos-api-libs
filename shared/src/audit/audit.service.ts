import { C_LOG_TRAIL, C_REQ, REPOSITORY } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { Repository } from '@common/core/repository';
import { Inject, Injectable } from '@nestjs/common';
import { AuditServiceMethods } from '@shared/audit/audit.dto';
import { Audit } from './audit.schema';

@Injectable()
export class AuditService implements AuditServiceMethods {
  constructor(
    @Inject(REPOSITORY) private readonly repository: Repository<Audit>,
    private readonly context: ContextService,
  ) {}

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
