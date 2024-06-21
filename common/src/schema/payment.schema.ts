import { SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

export class Payment extends BaseSchema {}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
