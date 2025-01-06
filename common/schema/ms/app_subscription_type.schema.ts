import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '../../decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Category from '@shared/category/category.schema';
import { Amount } from '../../dto/entity.dto';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsPeriod } from '../../validator';

export class ExtraUserPrice {
   @IsNumber()
   userBelow: number;

   @ValidateNested()
   @Type(() => Amount)
   pricePerUser: Amount;
}

export class SubscriptionPrice {
   @IsPeriod(false)
   periodBelow: string;

   @ValidateNested()
   @Type(() => Amount)
   price: Amount;

   @ValidateNested()
   @Type(() => ExtraUserPrice)
   extraEmployeePrice: ExtraUserPrice;

   @ValidateNested()
   @Type(() => ExtraUserPrice)
   extraAdminPrice: ExtraUserPrice;
}

@Schema()
export default class AppSubscriptionType {
   @AppProp({ type: Boolean, default: false })
   isOffline: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: AppSchema<Category>;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], default: [] })
   tags?: Array<AppSchema<Category>>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: AppSchema<Category>;

   // NOTE: may include this in the future if needed
   // @AppProp({ type: Boolean, default: false })
   // allowUnlimitedEmployee: boolean

   @AppProp({ type: Number, default: 1 })
   baseEmployeeCount: number;

   @AppProp({ type: Number, default: 1 })
   baseAdminCount: number;

   @AppProp({ type: Number, default: 7 })
   preSubEndMail: number;

   @AppProp({ type: SchemaTypes.Mixed }, { type: SubscriptionPrice })
   price: SubscriptionPrice;
}

export const AppSubscriptionTypeSchema = SchemaFactory.createForClass(AppSubscriptionType);
