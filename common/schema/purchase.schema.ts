import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { BaseSchema } from './base.schema';
import { ValidateIf } from 'class-validator';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Payment, Period, Status } from '@common/dto/global/entity.dto';

export class Purchase extends BaseSchema {
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
   subscriptionPeriod: Period;

   @ValidateIf((o) => o.subscription)
   @AppProp({ type: Date })
   startDate: Date;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Payment)
   payment: Payment;
}
