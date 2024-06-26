import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { EMerchantPurchase } from '@common/utils/enum';
import { BaseSchema } from './base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Period } from '@common/dto/entity.dto';
import { Payment } from './payment.schema';
import { Merchant } from './merchant.schema';

@Schema()
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
