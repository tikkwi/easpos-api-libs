import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { AllowanceCode } from '@common/schema/global/allowance_code.schema';

@Schema()
export class MerchantAllowanceCode extends AllowanceCode {}

export const MerchantAllowanceCodeSchema = SchemaFactory.createForClass(MerchantAllowanceCode);
