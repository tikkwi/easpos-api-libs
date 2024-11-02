import { Module } from '@nestjs/common';
import SubscriptionService from './subscription.service';
import MailModule from '../mail/mail.module';
import PurchaseModule from '../purchase/purchase.module';

@Module({
   imports: [MailModule, PurchaseModule],
   providers: [SubscriptionService],
   exports: [SubscriptionService],
})
export default class SubscriptionModule {}
