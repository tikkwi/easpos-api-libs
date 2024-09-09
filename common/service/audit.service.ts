import { Audit } from '@common/schema/audit.schema';
import { CoreService } from '@common/core/core.service';
import { pick } from 'lodash';
import { ContextService } from '@common/core/context.service';

export abstract class AuditService<T extends Audit = Audit> extends CoreService<T> {
   async logRequest(trail?: (d: CreateType<Audit>) => CreateType<T>) {
      const request = ContextService.get('request');
      const user = ContextService.get('user');

      const auditDto = {
         submittedIP: ContextService.get('ip'),
         sessionId: request?.sessionID,
         crossAppRequest: !ContextService.get('isHttp'),
         requestedFrom: ContextService.get('requestedApp'),
         userAgent: ContextService.get('userAgent') as any,
         logTrail: ContextService.get('logTrail'),
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
