import AppService from '@common/decorator/app_service.decorator';
import CoreService from '@common/core/core.service';
import PurchasedSubscription from './purchased_subscription.schema';
import { Inject } from '@nestjs/common';
import { PRE_END_SUB_MAIL, REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { $dayjs, getPeriodDate } from '@common/utils/datetime';
import { ConfigService } from '@nestjs/config';
import MailService from '../mail/mail.service';
import { EMail, EStatus } from '@common/utils/enum';
import { SubMonitorDto } from './purhased_subscription.dto';
import ContextService from '@common/core/context';

@AppService()
export default class PurchasedSubscriptionService extends CoreService<PurchasedSubscription> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<PurchasedSubscription>,
      private readonly configService: ConfigService,
      private readonly mailService: MailService,
   ) {
      super();
   }

   async subMonitor({ id, mail }: SubMonitorDto) {
      const { data: purSub } = await this.findById({
         id,
         errorOnNotFound: true,
         lean: false,
         populate: ['activePurchase', 'queuingPurchases', 'subscription'],
      });
      const isExpire = $dayjs().isAfter(purSub.expireDate);
      const isPreExpire = $dayjs().isAfter(
         $dayjs(purSub.expireDate).add(this.configService.get(PRE_END_SUB_MAIL)),
      );

      if (isExpire) {
         purSub.activePurchase = null;
         if (purSub.queuingPurchases.length) {
            let updInd = 0;
            const updActivePurchase = purSub.queuingPurchases.find(
               ({ status: { status } }, ind) => {
                  const found = status === EStatus.Approved;
                  if (found) updInd = ind;
                  return found;
               },
            );
            if (updActivePurchase) {
               purSub.queuingPurchases.splice(updInd, 1);
               updActivePurchase.status.status = EStatus.Active;
               purSub.expireDate = getPeriodDate(updActivePurchase.subscriptionPeriod);
               purSub.activePurchase = updActivePurchase;
            }
         }
         await purSub.save({ session: ContextService.get('session') });
      }

      if (!purSub.activePurchase || isPreExpire) {
         this.mailService.sendMail({
            mail,
            type: isPreExpire
               ? EMail.MerchantPreSubscriptionExpire
               : EMail.MerchantSubscriptionExpire,
            expirePayload: isPreExpire ? undefined : { expireDate: purSub.expireDate },
            preExpirePayload: isPreExpire ? { expireDate: purSub.expireDate } : undefined,
         });
      }
      return { data: purSub };
   }
}
