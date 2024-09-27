import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Purchase from '../purchase/purchase.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import Product from '../product/product.schema';

//NOTE: schema rather than object which is user/merchant field becz there can be sub with no user. (eg. sub selling merchant)
@Schema()
export default class PurchasedSubscription {
   @AppProp({ type: Date })
   subActiveDate: Date;

   @AppProp({ type: Date })
   expireAt: Date;

   @AppProp({ type: Boolean, default: false })
   sentExpiredMail: boolean;

   @AppProp({ type: Boolean, default: false })
   sentPreExpireMail: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Purchase' })
   activePurchase: AppSchema<Purchase>;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Purchase' }] })
   queuingPurchases: AppSchema<Purchase>[];

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Product' })
   product: AppSchema<Product>;
}

export const PurchasedSubscriptionSchema = SchemaFactory.createForClass(PurchasedSubscription);
