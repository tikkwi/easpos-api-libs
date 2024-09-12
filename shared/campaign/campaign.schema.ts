import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Status } from '@common/dto/entity.dto';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';

@Schema()
export default class Campaign extends BaseSchema {
   @AppProp({ type: String })
   name: string;

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
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
