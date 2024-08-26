import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Allowance } from '@common/schema/global/allowance.schema';

@Schema()
export class MerchantAllowance extends Allowance {}

export const MerchantAllowanceSchema = SchemaFactory.createForClass(MerchantAllowance);
