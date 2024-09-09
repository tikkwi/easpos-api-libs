import { AppProp } from '@common/decorator/app_prop.decorator';
import { BaseSchema } from '@common/schema/base.schema';
import { UnitCategory } from '@common/schema/unit_category.schema';

export class Unit extends BaseSchema {
   category?: UnitCategory; //NOTE: validation for using as unit (kg, viss etc.)

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
