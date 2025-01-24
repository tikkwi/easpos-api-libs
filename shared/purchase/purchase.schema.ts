import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Unit from '../unit/unit.schema';
import Category from '../category/category.schema';
import { Amount } from '@common/dto/entity.dto';
import APriceAdjustment from '../price_adjustment/price_adjustment.schema';

export default abstract class Purchase extends BaseSchema {
   abstract appliedAdjustments: Array<APriceAdjustment>;

   @AppProp({ type: String })
   voucherId: string;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   basePrice: Amount;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   paidPrice: Amount;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Unit' })
   currency: Unit;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   paymentMethod: Category;
}
