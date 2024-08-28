import { Audit } from '@common/schema/audit.schema';
import { pick } from 'lodash';
import { CoreService } from '@common/core/service/core.service';

export abstract class AuditService extends CoreService<Audit> {
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
