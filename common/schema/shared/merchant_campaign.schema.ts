import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Campaign } from '@common/schema/global/campaign.schema';

@Schema()
export class MerchantCampaign extends Campaign {}

export const MerchantCampaignSchema = SchemaFactory.createForClass(MerchantCampaign);
