import { ValidateIf } from 'class-validator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';

@Schema()
export default class Product extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description: string;

   @AppProp({ type: String, unique: true })
   qrCode: string;

   @AppProp({ type: [String], required: false })
   attachments: string[];

   @AppProp({ type: Boolean, required: false })
   nonDepleting: boolean;

   @ValidateIf((o) => !o.nonDepleting)
   @AppProp({ type: Number, required: false })
   numUnit?: number;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], required: false })
   tags?: Category[];

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
   unit?: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
