import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { ESubscription } from '@utils/enum';
import { AppProp } from '@decorator/app_prop.decorator';
import { Merchant } from './merchant.schema';
import { ValidateIf } from 'class-validator';
import { Purchase } from '@global_schema/purchase.schema';

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
