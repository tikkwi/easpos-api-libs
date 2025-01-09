import { pick } from 'lodash';
import BaseService from '@common/core/base/base.service';
import Audit from './audit.schema';

export default class AuditService extends BaseService<Audit> {
   async logRequest({
      connection,
      session,
      ip,
      request,
      requestedApp,
      userAgent,
      logTrail,
      user,
   }: RequestContext) {
      const repository = await this.getRepository(connection, session);

      return await repository.create({
         submittedIP: ip,
         sessionId: request?.sessionID,
         crossAppRequest: !request,
         requestedFrom: requestedApp,
         userAgent: userAgent as any,
         logTrail,
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
