import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '../decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Category from '@shared/category/category.schema';
import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { IsRecord } from '../validator';
import { EPeriod, EType } from '../utils/enum';
import { Type } from 'class-transformer';
import { Amount } from '../dto/entity.dto';

export class ExtraUserPrice {
   @IsNumber()
   userBelow: number;

   @IsNumber()
   pricePerUser: number;
}

export class SubscriptionPrice {
   @ValidateNested()
   @Type(() => Amount)
   basePrice: Amount;

   @IsNumber()
   basePeriod: number;

   @IsEnum(EPeriod)
   periodType: EPeriod;

   @IsNumber()
   baseAdminCount: number;

   @IsNumber()
   baseEmployeeCount: number;

   @IsNumber()
   defaultExtraAdminPrice: number;

   @IsNumber()
   defaultExtraEmployeePrice: number;

   @IsNumber()
   defaultExtraPeriodPrice: number;

   // NOTE: key -> user below, value -> price per user
   @IsOptional()
   @IsRecord({ value: EType.String, key: EType.Number })
   extraPeriodPrice?: Record<EPeriod, number>;

   // NOTE: key -> user below, value -> price per user
   @IsOptional()
   @IsRecord({ value: EType.Number, key: EType.Number })
   extraEmployeePrice?: Record<number, number>;

   @IsOptional()
   @IsRecord({ value: EType.Number, key: EType.Number })
   extraAdminPrice?: Record<number, number>;
}

@Schema()
export default class AppSubscriptionType {
   @AppProp({ type: Boolean, default: false })
   isOffline: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], default: [] })
   tags?: Array<Category>;

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
