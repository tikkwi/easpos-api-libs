import { SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@app/schema';

export class Payment extends BaseSchema {}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
