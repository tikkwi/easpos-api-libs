import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';

export class Currency extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String })
   nameShort: string;

   @AppProp({ type: String })
   symbol: string;

   @AppProp({ type: String })
   description: string;

   @AppProp({ type: Boolean, default: false })
   baseCurrency: boolean;

   @AppProp({ type: Boolean, default: true })
   active: boolean;

   @AppProp({ type: Number })
   basePrice: number;

   @AppProp({ type: String, required: false })
   remark?: string;
}
