import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '../decorator/app_prop.decorator';
import Purchase from '@app/purchase/purchase.schema';
import { SchemaTypes } from 'mongoose';
import { PriceAdjustment } from '@app/price_adjustment/price_adjustment.schema';
import SubscriptionType from '@app/subscription_type/subscription_type.schema';
import { EStatus } from '../utils/enum';
import { IsBoolean } from 'class-validator';

@Schema()
export default class Subscription extends Purchase {
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
   appliedAdjustments: Array<AppSchema<PriceAdjustment>>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'SubscriptionType' })
   subscriptionType: AppSchema<SubscriptionType>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: AppSchema<Merchant>;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
