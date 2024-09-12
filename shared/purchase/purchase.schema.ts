import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { ValidateIf } from 'class-validator';
import { Payment, Period, Status } from '@common/dto/entity.dto';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export default class Purchase extends BaseSchema {
   @AppProp({ type: String })
   voucherId: string;

   @AppProp({ type: Boolean })
   subscription: boolean;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Status)
   status: Status;

   @ValidateIf((o) => o.subscription)
   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Period)
   subscriptionPeriod?: Period;

   @ValidateIf((o) => o.subscription)
   @AppProp({ type: Date })
   startDate?: Date;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Payment)
   payment: Payment;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
