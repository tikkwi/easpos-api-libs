import { REPOSITORY } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { CoreService } from '@common/core/core.service';
import { Repository } from '@common/core/repository';
import { AppService } from '@common/decorator/app_service.decorator';
import { Inject } from '@nestjs/common';
import { AuditServiceMethods } from '@shared/audit/audit.dto';
import { Audit } from './audit.schema';

@AppService()
export class AuditService extends CoreService implements AuditServiceMethods {
  constructor(
    @Inject(REPOSITORY) private readonly repository: Repository<Audit>,
    protected readonly context: ContextService,
  ) {
    super();
  }

  async logRequest() {
    const request = this.context.get('request');
    const user = this.context.get('user');
    return await this.repository.create({
      submittedIP: request.ip,
      sessionId: request.sessionID,
      userAgent: request.headers['user-agent'] as any,
      logTrail: this.context.get('logTrail'),
      user: user
        ? {
            type: user.type,
            email: user.mail,
            name: `${user.firstName} ${user.lastName}`,
            user: user.id,
          }
        : undefined,
    });
  }
}
