import { SchemaTypes } from 'mongoose';
import { IsBoolean, IsNumber, ValidateIf } from 'class-validator';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Campaign } from '@common/schema/campaign.schema';
import { Type } from 'class-transformer';
import { Cash, ProductPurchased, Status, TimeRange } from '@common/dto/global/entity.dto';
import { EAllowance } from '@common/utils/enum';
import { Price } from '@common/schema/price.schema';
import { Currency } from '@common/schema/currency.schema';
import { Category } from '@common/schema/category.schema';
import { Address } from '@common/schema/address.schema';

export class AllowanceBenefit {
   @IsBoolean()
   percentage: boolean;

   @IsNumber()
   amount: number;
}

export abstract class Allowance extends BaseSchema {
   abstract benefit: AllowanceBenefit;
   abstract type: EAllowance;
   abstract applicablePrices: Price[];
   abstract currencyTrigger?: Currency[];
   abstract paymentMethodTrigger?: Category[];
   addressTrigger?: Address[];
   bundleTrigger?: ProductPurchased[];
   tierTrigger?: any[];

   @AppProp({ type: Number })
   numAllowance: number;

   @AppProp({ type: Boolean })
   autoTrigger: boolean;

   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: Boolean })
   perProduct: boolean;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: Boolean, default: false })
   stackable: boolean;

   @ValidateIf((o) => [EAllowance.SpendBase, EAllowance.TotalSpendBase].includes(o.type))
   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Cash)
   spendTrigger?: Cash;

   @ValidateIf((o) => o.type === EAllowance.TierBased)
   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => TimeRange)
   timeTrigger?: TimeRange;

   @ValidateIf((o) => [EAllowance.StockLevel, EAllowance.VolumeLevel].includes(o.type))
   @AppProp({ type: Number })
   levelTrigger?: number;

   @ValidateIf((o) => o.type === EAllowance.StockLevel)
   @AppProp({ type: Boolean })
   levelLowerTrigger?: boolean;

   @AppProp({ type: Date, required: false })
   endDate: Date;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Campaign' })
   campaign: Campaign;
}
