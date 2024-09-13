import AppService from '@common/decorator/app_service.decorator';
import CoreService from '@common/core/core.service';
import PurchasedSubscription from './purchased_subscription.schema';
import { Inject } from '@nestjs/common';
import { PRE_END_SUB_MAIL, REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { $dayjs, getPeriodDate } from '@common/utils/datetime';
import { ConfigService } from '@nestjs/config';
import MailService from '../mail/mail.service';
import { EMail } from '@common/utils/enum';
import { SubMonitorDto } from './purhased_subscription.dto';
import ContextService from '@common/core/context.service';

@AppService()
export class PurchasedSubscriptionService extends CoreService<PurchasedSubscription> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<PurchasedSubscription>,
      private readonly configService: ConfigService,
      private readonly mailService: MailService,
   ) {
      super();
   }

   async subMonitor({ id, mail }: SubMonitorDto) {
      const purSub = await this.findById({
         id,
         errorOnNotFound: true,
         lean: false,
      }).then(({ data }) => data.populate(['activePurchase', 'queuingPurchases', 'subscription']));
      const isExpire = $dayjs().isAfter(purSub.expireDate);
      const isPreExpire = $dayjs().isAfter(
         $dayjs(purSub.expireDate).add(this.configService.get(PRE_END_SUB_MAIL)),
      );

      if (!purSub.queuingPurchases.length && (isExpire || isPreExpire)) {
         this.mailService.sendMail({
            mail,
            type: isExpire ? EMail.MerchantSubscriptionExpire : EMail.MerchantPreSubscriptionExpire,
            expirePayload: isExpire ? { expireDate: purSub.expireDate } : undefined,
            preExpirePayload: isExpire ? undefined : { expireDate: purSub.expireDate },
         });
      }
      if (purSub.queuingPurchases.length && isExpire) {
         const updActivePurchase = purSub.queuingPurchases[0];
         purSub.queuingPurchases.splice(0, 1);
         purSub.expireDate = getPeriodDate(updActivePurchase.subscriptionPeriod);
         purSub.activePurchase = updActivePurchase;
         await purSub.save({ session: ContextService.get('session') });
      }
      return { data: purSub };
   }
}
