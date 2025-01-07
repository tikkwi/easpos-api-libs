import { pick } from 'lodash';
import BaseService from '@common/core/base/base.service';
import Audit from './audit.schema';
import { BaseDto } from '@common/dto/core.dto';

export default class AuditService extends BaseService<Audit> {
   async logRequest({
      ctx: { connection, ip, request, requestedApp, userAgent, logTrail, user },
   }: BaseDto) {
      const repository = await this.getRepository(connection);

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
