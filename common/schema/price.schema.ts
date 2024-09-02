/**
 * Difference between price & price level
 * Price is the manual price for different customers (retail, wholesale etc)
 * Price level trigger automatically based on the specific trigger points and adjust price.
 */
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Category } from '@common/schema/category.schema';
import { Product } from '@common/schema/product.schema';

export abstract class Price extends BaseSchema {
   abstract product: Product;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: Number })
   basePrice: number;
}
