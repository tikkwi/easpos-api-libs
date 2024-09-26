import { pick } from 'lodash';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import CoreService from '@common/core/core.service';
import Audit from './audit.schema';
import Repository from '@common/core/repository';
import { BaseDto } from '@common/dto/core.dto';

export default class AuditService extends CoreService<Audit> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Audit>) {
      super();
   }

   async logRequest({ context }: BaseDto) {
      const user = context.get('user');

      return await super.create({
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
