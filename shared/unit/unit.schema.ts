import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';
import { ValidateIf } from 'class-validator';

@Schema()
export default class Unit extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String })
   nameShort: string;

   @AppProp({ type: String })
   symbol: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: Boolean, default: false })
   isBase: boolean;

   @AppProp({ type: Boolean, default: true })
   active: boolean;

   @AppProp({ type: Number })
   baseUnit: number;

   @AppProp({ type: Boolean, default: false })
   isCurrency: boolean;

   @ValidateIf((o) => !o.isCurrency)
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category?: AppSchema<Category>;

   @AppProp({ type: String, required: false })
   remark?: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
