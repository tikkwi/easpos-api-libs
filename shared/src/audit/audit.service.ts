import { C_LOG_TRAIL, C_REQ, C_USER, REPOSITORY } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { Repository } from '@common/core/repository';
import { Inject, Injectable } from '@nestjs/common';
import { AuditServiceMethods } from '@shared/audit/audit.dto';
import { Audit } from './audit.schema';
import { Request } from 'express';
import { AuthUser } from '@common/dto/entity.dto';

@Injectable()
export class AuditService implements AuditServiceMethods {
  constructor(
    @Inject(REPOSITORY) private readonly repository: Repository<Audit>,
    private readonly context: ContextService,
  ) {}

  async logRequest() {
    const request = this.context.get<Request>(C_REQ);
    const user = this.context.get<AuthUser>(C_USER);
    return await this.repository.create({
      submittedIP: request.ip,
      sessionId: request.sessionID,
      userAgent: request.headers['user-agent'] as any,
      logTrail: this.context.get(C_LOG_TRAIL),
      user: user
        ? {
            type: user.type,
            email: user.mail,
            name: `${user.firstName} ${user.lastName}`,
            user: user._id,
          }
        : undefined,
    });
  }
}
