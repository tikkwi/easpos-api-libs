import { Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';

@Schema()
export default class Unit extends BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: Category;

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

   @AppProp({ type: String, required: false })
   remark?: string;
}
