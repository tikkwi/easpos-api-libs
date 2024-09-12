import { pick } from 'lodash';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import CoreService from '@common/core/core.service';
import Audit from './audit.schema';
import Repository from '@common/core/repository';
import ContextService from '@common/core/context.service';

export default class AuditService extends CoreService<Audit> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Audit>) {
      super();
   }

   async logRequest() {
      const request = ContextService.get('request');
      const user = ContextService.get('user');

      return await super.create({
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
      });
   }
}
