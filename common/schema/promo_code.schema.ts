import BaseSchema from '../core/base/base.schema';
import AppProp from '../decorator/app_prop.decorator';
import APriceAdjustment from './price_adjustment.schema';

export default abstract class APromoCode extends BaseSchema {
   abstract promotion: APriceAdjustment;
   abstract usage: Array<any>;

   //NOTE: false make promo code's numAllowance and usage will apply to user wide
   @AppProp({ type: Boolean, default: true })
   applyMerchantWide: boolean;

   @AppProp({ type: Number })
   numAllowance: number;

   @AppProp({ type: String, unique: true })
   code: string;

   @AppProp({ type: Date, required: false })
   expireAt: Date;
}
