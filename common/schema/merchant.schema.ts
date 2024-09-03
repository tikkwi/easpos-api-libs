import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '@common/schema/category.schema';
import { IsEmail, IsEnum, IsMongoId, IsPhoneNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { EStatus, ESubscription, EUserApp } from '@common/utils/enum';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Type } from 'class-transformer';
import { MFA, Status } from '@common/dto/global/entity.dto';
import { AppPurchase } from '@app/purchase/purchase.schema';

export class LoggedInMerchantUser {
   @IsMongoId()
   userId: string;

   @IsString()
   name: string;

   @IsEnum(EUserApp)
   app: EUserApp;
}

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

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => MFA)
   mfa?: MFA;

   @AppProp({ type: Boolean })
   verified: boolean;

   @AppProp({ type: Boolean, default: false, required: false })
   demoClaimed: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({
      type: String,
      enum: ESubscription,
      default: ESubscription.SharedSubscription,
      immutable: false,
   })
   subscriptionType: ESubscription;

   @AppProp({ type: [{ type: SchemaTypes.Mixed }], default: [] })
   @Type(() => LoggedInMerchantUser)
   loggedInUsers: LoggedInMerchantUser[];

   @AppProp({ type: SchemaTypes.Mixed, immutable: false, default: { status: EStatus.Pending } })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: Boolean, default: false, required: false })
   sentSubEndMail?: boolean;

   @AppProp({ type: Boolean, default: false, required: false })
   sentPreSubEndMail?: boolean;

   @AppProp({ type: Number, default: 0 })
   totalSpend: number;

   @AppProp({
      type: [
         {
            type: SchemaTypes.ObjectId,
            ref: 'MerchantPurchase',
         },
      ],
      immutable: false,
      required: false,
   })
   activePurchases?: AppPurchase[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
