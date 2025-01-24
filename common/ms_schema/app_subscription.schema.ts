import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '../decorator/app_prop.decorator';
import Purchase from '@shared/purchase/purchase.schema';
import { SchemaTypes } from 'mongoose';
import { SubPriceAdjustment } from './sub_price_adjustment.schema';
import AppSubscriptionType from './app_subscription_type.schema';
import { EStatus } from '../utils/enum';
import { IsBoolean } from 'class-validator';
import { Payment } from '../dto/entity.dto';

@Schema()
export default class AppSubscription extends Purchase {
   @AppProp({ type: Date })
   startDate: Date;

   @AppProp({ type: Date, required: false })
   endDate?: Date;

   @AppProp({ type: String, enum: EStatus, default: EStatus.Pending })
   status: EStatus;

   @AppProp({ type: Number, required: false })
   extraEmployeeCount: number;

   @AppProp({ type: Number, required: false })
   extraAdminCount: number;

   @IsBoolean()
   sentExpiredMail: boolean;

   @IsBoolean()
   sentPreExpiredMail: boolean;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Payment })
   payment: Payment;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'SubscriptionType' }], default: [] })
   appliedAdjustments: Array<SubPriceAdjustment>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'SubscriptionType' })
   subscriptionType: AppSubscriptionType;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const AppSubscriptionSchema = SchemaFactory.createForClass(AppSubscription);
