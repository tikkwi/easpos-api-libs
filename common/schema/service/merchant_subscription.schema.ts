import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Merchant } from './merchant.schema';
import { ValidateIf } from 'class-validator';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Purchase } from '@common/schema/global/purchase.schema';
import { ESubscription } from '@common/utils/enum';

@Schema()
export class MerchantSubscription extends Purchase {
   @AppProp({ type: String, enum: ESubscription })
   type: ESubscription;

   @AppProp({ type: Number })
   price: number;

   //NOTE: num user don't mean only specific number of user can create account.. It's more like num concurrent user.
   @ValidateIf((o) => ![ESubscription.Offline, ESubscription.Demo].includes(o.type))
   @AppProp({ type: Number })
   numUser: number;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const MerchantSubscriptionSchema = SchemaFactory.createForClass(MerchantSubscription);
