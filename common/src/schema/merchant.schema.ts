import { AppProp } from '@common/decorator/app_prop.decorator';
import { EStatus, ESubscription } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from '@shared/address/address.schema';
import { Category } from '@shared/category/category.schema';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { BaseSchema } from './base.schema';
import { MerchantPurchase } from './merchant_purchase.schema';
import { Type } from 'class-transformer';
import { Status } from '@common/dto/entity.dto';

@Schema()
export class Merchant extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String })
   @IsEmail()
   mail: string;

   @AppProp({ type: String })
   @IsPhoneNumber()
   mobileNo: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Address' })
   address: Address;

   @AppProp({
      type: String,
      enum: ESubscription,
      default: ESubscription.SharedSubscription,
      required: false,
   })
   subscriptionType?: ESubscription;

   @AppProp({ type: SchemaTypes.Mixed, immutable: false, default: { status: EStatus.Pending } })
   @Type(() => Status)
   status?: Status;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   metadata?: any;

   @AppProp({
      type: SchemaTypes.ObjectId,
      ref: 'MerchantPurchase',
      immutable: false,
   })
   activePurchase: MerchantPurchase;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
   owner?: User;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
