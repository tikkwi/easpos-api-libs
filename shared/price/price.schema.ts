import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';
import Product from '../product/product.schema';

@Schema()
export default class Price extends BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: Number })
   basePrice: number;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Product' })
   product: Product;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
