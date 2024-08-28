import { SchemaTypes } from 'mongoose';
import { IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Campaign } from '@common/schema/campaign.schema';

export class AllowanceBenefit {
   @IsBoolean()
   isAbsolute?: boolean;

   @IsNumber()
   amount: number;
}

export class Allowance extends BaseSchema {
   @AppProp({ type: String })
   title: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => AllowanceBenefit)
   benefit: AllowanceBenefit;

   @AppProp({ type: Date, required: false })
   endDate: Date;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Campaign' })
   campaign: Campaign;
}
