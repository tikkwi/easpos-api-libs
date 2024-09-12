import BaseSchema from '@common/core/base.schema';
import Allowance from '../allowance/allowance.schema';
import AppProp from '@common/decorator/app_prop.decorator';

export default abstract class AllowanceCode extends BaseSchema {
   abstract allowance: Allowance;

   @AppProp({ type: Number })
   numAllowance: number;

   @AppProp({ type: String, unique: true })
   code: string;

   @AppProp({ type: Date, required: false })
   expireAt: Date;
}
