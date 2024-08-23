import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@global_schema/base.schema';
import { AppProp } from '@decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { EUser } from '@utils/enum';
import { ValidateIf } from 'class-validator';
import { Allowance } from '@global_schema/allowance.schema';

@Schema()
export class AllowanceCode extends BaseSchema {
   @AppProp({ type: String, unique: true })
   code: string;

   @AppProp({ type: Date, required: false })
   expireAt: Date;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Allowance' })
   allowance: Allowance;

   //NOTE: for the referral program
   @AppProp({ type: Boolean, required: false })
   isMerchantReferral?: EUser;

   @ValidateIf((o) => o.userType !== undefined)
   @AppProp({ type: SchemaTypes.ObjectId })
   user: any; //Merchant User / Customer
}

export const AllowanceCodeSchema = SchemaFactory.createForClass(AllowanceCode);
