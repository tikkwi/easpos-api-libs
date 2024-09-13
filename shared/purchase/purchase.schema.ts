import { SchemaTypes } from 'mongoose';
import { ValidateIf } from 'class-validator';
import { Payment, Period, Status } from '@common/dto/entity.dto';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { EStatus } from '@common/utils/enum';
import Product from '../product/product.schema';

@Schema()
export default class Purchase extends BaseSchema {
   @AppProp({ type: String })
   voucherId: string;

   @AppProp({ type: Boolean })
   subscription: boolean;

   @AppProp(
      { type: SchemaTypes.Mixed, immutable: false, default: { status: EStatus.Pending } },
      { type: Status },
   )
   status: Status;

   @ValidateIf((o) => o.subscription)
   @AppProp({ type: SchemaTypes.Mixed }, { type: Period })
   subscriptionPeriod?: Period;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Payment })
   payment: Payment;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Product' })
   product: Product;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
