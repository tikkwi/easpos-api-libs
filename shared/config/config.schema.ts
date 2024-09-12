import { Max } from 'class-validator';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';

export default class Config extends BaseSchema {
   @AppProp({ type: Number, default: 70 })
   @Max(90)
   max_price_lvl_allowance: number;
}
