import { SchemaTypes } from 'mongoose';
import { ValidateIf } from 'class-validator';
import { Amount, TimeRange } from '../dto/entity.dto';
import { EPriceAdjustment, EStatus, EStockPriceAdjustment } from '../utils/enum';
import BaseSchema from '../core/base.schema';
import AppProp from '../decorator/app_prop.decorator';
import Campaign from '@shared/campaign/campaign.schema';
import Category from '@shared/category/category.schema';
import Unit from '@shared/unit/unit.schema';

export default abstract class APriceAdjustment extends BaseSchema {
   abstract types: Array<EPriceAdjustment | EStockPriceAdjustment>;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   adjustment: Amount;

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

   @AppProp({ type: Boolean, default: false })
   stackable: boolean;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Spend))
   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   spendTrigger?: Amount;

   @ValidateIf((o) => o.types.includes(EPriceAdjustment.Tier))
   @AppProp({ type: SchemaTypes.Mixed }, { type: TimeRange })
   timeTrigger?: TimeRange;

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
