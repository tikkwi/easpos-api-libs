import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';

/*
 * NOTE:
 * use category in case needed because difference between unit is unit is stable and currency is volatile
 * so it we convert everywhere and store only base will lead to inaccurate data..
 * */
export class Currency extends BaseSchema {
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
