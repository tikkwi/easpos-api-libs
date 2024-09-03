import { Audit } from '@common/schema/audit.schema';
import { CoreService } from '@common/core/service/core.service';
import { pick } from 'lodash';

export abstract class AuditService<T extends Audit = Audit> extends CoreService<T> {
   async logRequest(trail?: (d: CreateType<Audit>) => CreateType<T>) {
      const request = this.context.get('request');
      const user = this.context.get('user');

      const auditDto = {
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
      };
      return await super.create(trail ? trail(auditDto) : (auditDto as CreateType<T>));
   }
}
