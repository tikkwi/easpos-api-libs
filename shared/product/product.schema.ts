import { ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';
import { EProduct } from '@common/utils/enum';
import { Price } from '@common/dto/entity.dto';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export class BaseProduct extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description: string;

   @AppProp({ type: String, unique: true })
   qrCode: string;

   @AppProp({ type: [String], required: false })
   attachments: string[];

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: Price })
   prices: Price[];
}

@Schema()
export default class Product extends BaseProduct {
   @AppProp({ type: Boolean, required: false })
   nonDepleting: boolean;

   @ValidateIf((o) => !o.nonDepleting)
   @AppProp({ type: Number, required: false })
   numUnit?: number;

   @AppProp({ type: String, enum: EProduct })
   type: EProduct;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: AppSchema<Category>;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], required: false })
   tags?: AppSchema<Category>[];

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
   unit?: AppSchema<Category>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   subType: AppSchema<Category>;

   @AppProp({ type: Number, default: 1 })
   allowanceCount: number;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: Price })
   extraAllowancePrices: Price[];

   @AppProp({ type: [SchemaTypes.Mixed], required: false }, { type: BaseProduct })
   plugins?: BaseProduct[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
