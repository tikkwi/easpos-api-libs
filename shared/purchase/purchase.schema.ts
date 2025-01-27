import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Unit from '../unit/unit.schema';
import Category from '../category/category.schema';
import APriceAdjustment from '../price_adjustment/price_adjustment.schema';

export default abstract class Purchase extends BaseSchema {
   abstract appliedAdjustments: Array<APriceAdjustment>;

   @AppProp({ type: Boolean })
   isFree: boolean;

   @AppProp({ type: Number })
   basePrice: number;

   @AppProp({ type: Number })
   paidPrice: number;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Unit' })
   currency: Unit;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   paymentMethod: Category;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   paymentProvider: Category;
}
