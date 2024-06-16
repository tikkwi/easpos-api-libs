import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { BaseSchema, Merchant, Payment } from '@app/schema';
import { AppProp } from '@app/decorator';
import { Period } from '@app/dto';
import { EMerchantPurchase } from '@app/helper';

export class MerchantPurchase extends BaseSchema {
  @AppProp({ type: String })
  vouncherId: string;

  @AppProp({ type: SchemaTypes.Mixed, required: false })
  @Type(() => Period)
  subscriptionPeriod?: Period;

  @AppProp({ type: String, enum: EMerchantPurchase })
  type: EMerchantPurchase;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
  merchant: Merchant;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Payment', required: false })
  payment: Payment;
}

export const MerchantPurchaseSchema = SchemaFactory.createForClass(MerchantPurchase);
