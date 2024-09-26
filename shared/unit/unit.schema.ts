import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';
import { ValidateIf } from 'class-validator';

@Schema()
export default class Unit extends BaseSchema {
   @AppProp({ type: Boolean, default: false })
   default: boolean;

   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String })
   nameShort: string;

   @AppProp({ type: String })
   symbol: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: Boolean, default: false })
   base: boolean;

   @AppProp({ type: Boolean, default: true })
   active: boolean;

   @AppProp({ type: Number })
   baseUnit: number;

   @AppProp({ type: Boolean, default: false })
   currency: boolean;

   @ValidateIf((o) => !o.currency)
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category?: Category;

   @AppProp({ type: String, required: false })
   remark?: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
