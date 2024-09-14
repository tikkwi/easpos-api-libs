import { SchemaTypes } from 'mongoose';
import { ValidateIf } from 'class-validator';
import { Payment, Period, Status } from '@common/dto/entity.dto';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { EStatus } from '@common/utils/enum';
import Product, { BaseProduct } from '../product/product.schema';
import { OmitType } from '@nestjs/swagger';

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

   @AppProp({ type: Number, default: 1 })
   allowanceCount: number;

   @AppProp(
      { type: [SchemaTypes.Mixed], required: false },
      { type: OmitType(BaseProduct, ['prices']) },
   )
   plugins?: Omit<BaseProduct, 'prices'>[];

   @ValidateIf((o) => o.subscription)
   @AppProp({ type: SchemaTypes.Mixed }, { type: Period })
   subscriptionPeriod?: Period;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Payment })
   payment: Payment;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Product' })
   product: Product;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
