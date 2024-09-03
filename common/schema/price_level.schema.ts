import { BaseSchema } from '@common/schema/base.schema';
import { EPrice } from '@common/utils/enum';
import { Category } from '@common/schema/category.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Currency } from '@common/schema/currency.schema';
import { Max, Min, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Status } from '@common/dto/global/entity.dto';
import { Price } from '@common/schema/price.schema';

//TODO: validate total price level allowance not to be higher than threshold
export abstract class PriceLevel extends BaseSchema {
   abstract type: EPrice;
   abstract applicablePrices: Price[];
   abstract currency?: Currency;
   abstract paymentMethod?: Category;

   @AppProp({ type: Boolean })
   perProduct: boolean;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: Number, unique: true })
   @Min(1)
   @Max(10)
   priority: number;

   @ValidateIf((o) => [EPrice.SpendBase, EPrice.TotalSpendBase].includes(o.type))
   @AppProp({ type: Number })
   spendTriggerAmount?: number;

   @AppProp({ type: Boolean, default: false })
   stackable: boolean;

   @AppProp({ type: Boolean, default: false })
   percentage: boolean;

   @AppProp({ type: Number })
   amount: number;

   @AppProp({ type: String, required: false })
   name?: string;

   @AppProp({ type: String, required: false })
   description?: string;
}
