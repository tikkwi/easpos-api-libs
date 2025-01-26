import { SchemaTypes } from 'mongoose';
import { ValidateIf } from 'class-validator';
import { Amount, PeriodRange } from '@common/dto/entity.dto';
import { EPriceAdjustment, EStatus } from '@common/utils/enum';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '../category/category.schema';
import Unit from '../unit/unit.schema';
import { intersection } from 'lodash';

//NOTE: for priority will be fetched from merchant config
// can only have at most 1 markup, promote adjustment (took highest if multiple applicable)
//TODO: update in user app wrt updated schema
/*
 * TODO:
 * applyWholeSale -> true
 * Don't allow StockLevelLower/Higher and Volume
 * applyWholeSale -> false
 * Don't allow Bundle and Spend
 * */
export default abstract class APriceAdjustment extends BaseSchema {
   //NOTE: empty types doesn't mean allow in all purchase, it means allow
   //for claiming with promo code without requiring any trigger
   abstract types: Array<EPriceAdjustment>;
   abstract adjustment: any;

   @AppProp({ type: Boolean })
   isMarkup: boolean;

   //TODO: validate in promo-code for not creating promo code for auto trigger
   @AppProp({ type: Boolean })
   autoTrigger: boolean;

   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: Boolean })
   perProduct: boolean;

   @AppProp({ type: String, enum: EStatus, default: EStatus.Active })
   status: EStatus;

   @AppProp({ type: Date, required: false })
   expireAt?: Date;

   @ValidateIf(
      (o) => !!intersection([EPriceAdjustment.Spend, EPriceAdjustment.TotalSpend], o.types).length,
   )
   @AppProp({ type: Boolean, default: false })
   spendTriggerBelow?: boolean;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Spend))
   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   spendTrigger?: Amount;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.TotalSpend))
   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   totalSpendTrigger?: Amount;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Tier))
   @AppProp({ type: SchemaTypes.Mixed }, { type: PeriodRange })
   timeTrigger?: PeriodRange;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.PaymentMethod))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   paymentMethodTrigger?: Array<Category>;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.PaymentProvider))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   paymentProviderTrigger?: Array<Category>;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Currency))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Currency' }] })
   currencyTrigger?: Array<Unit>;
}
