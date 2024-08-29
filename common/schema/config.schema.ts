import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Max } from 'class-validator';

export class Config extends BaseSchema {
   @AppProp({ type: Number, default: 70 })
   @Max(90)
   max_price_lvl_allowance: number;
}
