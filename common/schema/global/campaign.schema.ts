import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Category } from '@shared/category/category.schema';
import { ValidateIf } from 'class-validator';
import { BaseSchema } from '@common/schema/global/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Status } from '@common/dto/global/entity.dto';

@Schema()
export class Campaign extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: Boolean, default: false }) //default campaign that will create together with merchant (point shop) and a merchant can only have one campaign that can exchange
   cusExchangeable?: boolean;

   @AppProp({ type: Date })
   startDate: Date;

   @AppProp({ type: Date })
   endDate: Date;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: String, required: false })
   terms?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
   type?: Category;

   @AppProp({ type: Boolean })
   merchantCampaign?: boolean;

   @ValidateIf((o) => !o.merchantCampaign)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Branch' }] })
   appliedBranches: any[]; //Branch
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
