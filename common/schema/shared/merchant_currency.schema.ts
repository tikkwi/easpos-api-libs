import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Currency } from '@common/schema/global/currency.schema';

@Schema()
export class MerchantCurrency extends Currency {}

export const MerchantCurrencySchema = SchemaFactory.createForClass(MerchantCurrency);
