import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { BaseSchema, Merchant, Payment } from '@common/schema';
import { AppProp } from '@common/decorator';
import { Period } from '@common/dto';
import { EMerchantPurchase } from '@common/helper';

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

export const MerchantPurchaseSchema =
  SchemaFactory.createForClass(MerchantPurchase);
