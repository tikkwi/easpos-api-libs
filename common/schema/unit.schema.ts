import { Currency } from '@common/schema/currency.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { UnitCategory } from '@common/schema/unit_category.schema';

//NOTE: only store base unit wherever possible
export class Unit extends Currency {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'UnitCategory' })
   category: UnitCategory;
}
