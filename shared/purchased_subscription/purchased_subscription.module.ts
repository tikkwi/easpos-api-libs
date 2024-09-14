import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PurchasedSubscription, {
   PurchasedSubscriptionSchema,
} from './purchased_subscription.schema';
import { getRepositoryProvider } from '@common/utils/misc';
import PurchasedSubscriptionService from './purchased_subscription.service';
import MailModule from '../mail/mail.module';

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: PurchasedSubscription.name, schema: PurchasedSubscriptionSchema },
      ]),
      MailModule,
   ],
   providers: [
      PurchasedSubscriptionService,
      getRepositoryProvider({ name: PurchasedSubscription.name }),
   ],
   exports: [PurchasedSubscriptionService],
})
export default class PurchasedSubscriptionModule {}
