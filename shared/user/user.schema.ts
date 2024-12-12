import { hashSync } from 'bcryptjs';
import {
   IsDateString,
   IsEmail,
   IsEnum,
   IsOptional,
   IsPhoneNumber,
   IsString,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { EStatus, ETmpBlock, EUser } from '@common/utils/enum';
import { MFA } from '@common/dto/entity.dto';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Address from '../address/address.schema';
import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import Category from '../category/category.schema';

export class TmpBlock {
   @IsDateString()
   until: Date;

   @IsEnum(ETmpBlock)
   type: ETmpBlock;

   @IsOptional()
   @IsString()
   remark?: string;
}

//TODO: guest user for customer
export default class User extends BaseSchema {
   @AppProp({ type: String, unique: true }, { userName: true })
   userName: string;

   @AppProp({ type: String, enum: EUser, default: EUser.Merchant, required: false })
   type: EUser;

   @AppProp({ type: String, enum: EStatus, default: EStatus.Active })
   status?: EStatus;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: TmpBlock })
   tmpBlock?: TmpBlock;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: MFA })
   mfa?: MFA;

   @AppProp({ type: String })
   firstName: string;

   @AppProp({ type: String })
   lastName: string;

   @AppProp({ type: String })
   @IsEmail()
   mail: string;

   @AppProp({
      type: String,
      set: (pas) => hashSync(pas, 16),
   })
   password: string;

   @AppProp({ type: String })
   @IsPhoneNumber()
   mobileNo: string;

   @AppProp({ type: Boolean, default: false })
   mailVerified?: boolean;

   @AppProp({ type: Boolean, default: false })
   mobileVerified?: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Address', required: false })
   address?: AppSchema<Address>;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], default: [] })
   tags?: Array<AppSchema<Category>>;
}

const basePartialFields: Array<keyof User> = ['mail', 'mobileNo'];

export class BaseUser extends IntersectionType(
   OmitType(User, basePartialFields),
   PartialType(PickType(User, basePartialFields)),
) {}
