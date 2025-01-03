import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '../../decorator/app_prop.decorator';
import Purchase from '@shared/purchase/purchase.schema';
import { SchemaTypes } from 'mongoose';
import { SubPriceAdjustment } from './sub_price_adjustment.schema';
import AppSubscriptionType from './app_subscription_type.schema';
import { EStatus } from '../../utils/enum';
import { IsBoolean } from 'class-validator';

@Schema()
export default class AppSubscription extends Purchase {
   @AppProp({ type: Date })
   startDate: Date;

   @AppProp({ type: Date, required: false })
   endDate?: Date;

   @AppProp({ type: String, enum: EStatus })
   status: EStatus;

   @AppProp({ type: Number, required: false })
   extraEmployeeCount: number;

   @AppProp({ type: Number, required: false })
   extraAdminCount: number;

   @IsBoolean()
   sentExpiredMail: boolean;

   @IsBoolean()
   sentPreExpiredMail: boolean;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'SubscriptionType' }] })
   appliedAdjustments: Array<AppSchema<SubPriceAdjustment>>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'SubscriptionType' })
   subscriptionType: AppSchema<AppSubscriptionType>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: AppSchema<Merchant>;
}

export const AppSubscriptionSchema = SchemaFactory.createForClass(AppSubscription);
