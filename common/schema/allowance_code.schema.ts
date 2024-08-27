import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Allowance } from '@common/schema/allowance.schema';
import { ValidateIf } from 'class-validator';

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
