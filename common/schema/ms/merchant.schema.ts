import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsEnum, IsMongoId, IsPhoneNumber, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { EStatus, EUserApp } from '../../utils/enum';
import { Amount, MFA } from '../../dto/entity.dto';
import BaseSchema from '../../core/base/base.schema';
import AppProp from '../../decorator/app_prop.decorator';
import Category from '@shared/category/category.schema';

export class LoggedInMerchantUser {
   @IsMongoId()
   userId: string;

   @IsString()
   name: string;

   @IsEnum(EUserApp)
   app: EUserApp;
}

@Schema()
export default class Merchant extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String })
   @IsEmail()
   mail: string;

   @AppProp({ type: String })
   @IsPhoneNumber()
   mobileNo: string;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: MFA })
   mfa?: MFA;

   @AppProp({ type: Boolean })
   verified: boolean;

   @AppProp({ type: Boolean, default: false, required: false })
   demoClaimed: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: AppSchema<Category>;

   @AppProp({ type: [{ type: SchemaTypes.Mixed }], default: [] }, { type: LoggedInMerchantUser })
   loggedInUsers: LoggedInMerchantUser[];

   @AppProp({ type: String, enum: EStatus, default: EStatus.Pending })
   status: EStatus;

   @AppProp({ type: Boolean, default: false, required: false })
   sentSubEndMail?: boolean;

   @AppProp({ type: Boolean, default: false, required: false })
   sentPreSubEndMail?: boolean;

   @AppProp({ type: [SchemaTypes.Mixed], default: 0 }, { type: Amount })
   totalSpend: Amount[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
