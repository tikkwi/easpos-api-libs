import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidateIf } from 'class-validator';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { ESubscription } from '@common/utils/enum';
import { MerchantBase } from '@common/schema/global/merchant_base.schema';
import { SchemaTypes } from 'mongoose';
import { MerchantSubscription } from '@common/schema/shared/merchant_subscription.schema';
import { IntersectionType } from '@nestjs/swagger';
import { Purchase } from '@common/schema/global/purchase.schema';

@Schema()
export class MerchantPurchasedSubscription extends IntersectionType(Purchase, MerchantBase) {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'MerchantSubscription' })
   type: MerchantSubscription;

   @ValidateIf((o) => ![ESubscription.Offline, ESubscription.Demo].includes(o.type))
   @AppProp({ type: Number })
   numUser: number;
}

export const MerchantPurchasedSubscriptionSchema = SchemaFactory.createForClass(
   MerchantPurchasedSubscription,
);
