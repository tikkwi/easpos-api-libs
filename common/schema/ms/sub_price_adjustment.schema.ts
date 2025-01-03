import APriceAdjustment from '../price_adjustment.schema';
import AppProp from '../../decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { EPriceAdjustment } from '../../utils/enum';
import { IsAppEnum } from '../../validator';
import { Max, Min, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';

export class Adjustment {
   @ValidateIf((o) => !o.absoluteAdjustment)
   @Min(0.001)
   @Max(100)
   percentageAdjustment?: number;

   @ValidateIf((o) => !o.percentageAdjustment)
   @Min(0.001)
   @Max(100)
   absoluteAdjustment?: number;
}

@Schema()
export class SubPriceAdjustment extends APriceAdjustment {
   @AppProp(
      { type: String, enum: EPriceAdjustment },
      {
         validateEnum: false,
         validators: [
            {
               func: IsAppEnum,
               args: [
                  EPriceAdjustment,
                  {
                     pick: [
                        EPriceAdjustment.Time,
                        EPriceAdjustment.Spend,
                        EPriceAdjustment.PaymentMethod,
                        EPriceAdjustment.Currency,
                     ],
                  },
               ],
            },
         ],
      },
   )
   types: Array<
      | EPriceAdjustment.Time
      | EPriceAdjustment.Spend
      | EPriceAdjustment.PaymentMethod
      | EPriceAdjustment.Currency
   >;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Adjustment })
   adjustment: Adjustment;
}

export const SubPriceAdjustmentSchema = SchemaFactory.createForClass(SubPriceAdjustment);
