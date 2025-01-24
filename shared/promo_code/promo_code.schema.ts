import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import APriceAdjustment from '../price_adjustment/price_adjustment.schema';
import { EStatus } from '@common/utils/enum';

export default abstract class APromoCode extends BaseSchema {
   abstract promotion: APriceAdjustment;
   abstract usage?: Array<any>;

   @AppProp({ type: Number })
   numAllowance: number;

   @AppProp({ type: String, enum: EStatus, default: EStatus.Active })
   status: EStatus;

   @AppProp({ type: String, unique: true })
   code: string;

   @AppProp({ type: Date, required: false })
   expireAt: Date;
}
