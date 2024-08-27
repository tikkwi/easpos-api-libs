import { Inject } from '@nestjs/common';
import { AuditServiceMethods } from '@common/dto/global/audit.dto';
import { Audit } from '@common/schema/audit.schema';
import { pick } from 'lodash';
import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';

@AppService()
export class AuditService extends CoreService implements AuditServiceMethods {
   constructor(
      protected readonly context: ContextService,
      @Inject(REPOSITORY) private readonly repository: Repository<Audit>,
   ) {
      super();
   }

   async logRequest() {
      const request = this.context.get('request');
      const user = this.context.get('user');

      return await this.repository.create({
         submittedIP: this.context.get('ip'),
         sessionId: request?.sessionID,
         crossAppRequest: !this.context.get('isHttp'),
         requestedFrom: this.context.get('requestedApp'),
         userAgent: this.context.get('userAgent') as any,
         logTrail: this.context.get('logTrail'),
         user: user
            ? {
                 id: user.id,
                 name: `${user.firstName} ${user.lastName}`,
                 ...pick(user, ['type', 'userName', 'mail']),
              }
            : undefined,
      });
   }
}
