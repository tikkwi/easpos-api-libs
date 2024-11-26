import { SchemaTypes } from 'mongoose';
import { ValidateIf } from 'class-validator';
import { Amount, PeriodRange } from '../dto/entity.dto';
import { EPriceAdjustment, EStatus } from '../utils/enum';
import BaseSchema from '../core/base.schema';
import AppProp from '../decorator/app_prop.decorator';
import Campaign from '@shared/campaign/campaign.schema';
import Category from '@shared/category/category.schema';
import Unit from '@shared/unit/unit.schema';

//NOTE: for priority will be fetched from merchant config
export default abstract class APriceAdjustment extends BaseSchema {
   /*
    * TODO:
    * applyWholeSale -> true
    * Don't allow StockLevelLower/Higher and Volume
    * applyWholeSale -> false
    * Don't allow Bundle and Spend
    * */
   abstract types: Array<EPriceAdjustment>;
   abstract adjustment: any;

   @AppProp({ type: Boolean })
   isMarkup: boolean;

   @AppProp({ type: Boolean })
   isPromo: boolean;

   @AppProp({ type: Boolean })
   applyWholeSale: boolean;

   //TODO: validate in promo-code for not creating promo code for auto trigger
   @AppProp({ type: Boolean })
   autoTrigger: boolean;

   //NOTE: if this flag is false, must applicable through triggers even though coupon code provided
   @AppProp({ type: Boolean })
   isCouponPrioritize: boolean;

   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: Boolean })
   perProduct: boolean;

   @AppProp({ type: String, enum: EStatus, default: EStatus.Active })
   status: EStatus;

   //NOTE: stackable mean whole adj can still apply if there are already product adjustments(only 1 whole adj can apply)..
   @AppProp({ type: Boolean, default: false })
   stackable: boolean;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   spendTrigger?: Amount;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Tier) && !o.applyWholeSale)
   @AppProp({ type: SchemaTypes.Mixed }, { type: PeriodRange })
   timeTrigger?: PeriodRange;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.PaymentMethod))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   paymentMethodTrigger?: AppSchema<Category>[];

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Currency))
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Currency' }] })
   currencyTrigger?: AppSchema<Unit>[];

   @AppProp({ type: Date, required: false })
   expireAt?: Date;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Campaign' })
   campaign: AppSchema<Campaign>;
}
