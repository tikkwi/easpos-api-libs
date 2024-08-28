import { BaseSchema } from '@common/schema/base.schema';
import { EPrice } from '@common/utils/enum';
import { Category } from '@common/schema/category.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Currency } from '@common/schema/currency.schema';
import { Max, Min } from 'class-validator';

export abstract class PriceLevel extends BaseSchema {
   abstract type: EPrice;

   //NOTE: validate on specific app
   currency?: Currency;

   //NOTE: validate on specific app
   paymentMethod?: Category;

   @AppProp({ type: Number, unique: true })
   @Min(1)
   @Max(10)
   priority: number;

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
