import { $dayjs } from '@common/utils/datetime';
import MailService from '../mail/mail.service';
import { EMail, EStatus } from '@common/utils/enum';
import { SubMonitorDto } from './subscription.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class SubscriptionService {
   constructor(private readonly mailService: MailService) {}

   async subMonitor({ subscription, mail, preSubEndMail }: SubMonitorDto) {
      const isExpire = $dayjs().isAfter(subscription.expireAt);
      const isPreExpire = $dayjs().isAfter(
         $dayjs(subscription.expireAt).add(preSubEndMail, 'days'),
      );

      if (isExpire) subscription.status = EStatus.Expired;

      if (isExpire || isPreExpire) {
         this.mailService.sendMail({
            mail,
            type: isPreExpire
               ? EMail.MerchantPreSubscriptionExpire
               : EMail.MerchantSubscriptionExpire,
            expirePayload: isPreExpire ? undefined : { expireAt: subscription.expireAt },
            preExpirePayload: isPreExpire ? { expireAt: subscription.expireAt } : undefined,
         });
      }
      return { data: subscription };
   }
}
