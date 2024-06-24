import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema()
export class Payment extends BaseSchema {}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
