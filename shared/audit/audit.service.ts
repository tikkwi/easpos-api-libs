import { pick } from 'lodash';
import BaseService from '@common/core/base/base.service';
import Audit from './audit.schema';
import RequestContextService from '@common/core/request_context/request_context_service';

export default class AuditService extends BaseService<Audit> {
   async logRequest() {
      const repository = await this.getRepository();
      const context = await this.moduleRef.resolve(RequestContextService);
      const user = context.get('user');

      return await repository.create({
         submittedIP: context.get('ip'),
         sessionId: context.get('request')?.sessionID,
         crossAppRequest: !context.get('request'),
         requestedFrom: context.get('requestedApp'),
         userAgent: context.get('userAgent') as any,
         logTrail: context.get('logTrail'),
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
