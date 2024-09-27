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
import { MFA, Status } from '@common/dto/entity.dto';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Address from '../address/address.schema';

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

   @AppProp(
      { type: SchemaTypes.Mixed, immutable: false, default: { status: EStatus.Pending } },
      { type: Status },
   )
   status?: Status;

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

   @AppProp({ type: String, required: false })
   @IsPhoneNumber()
   mobileNo?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Address', required: false })
   address?: AppSchema<Address>;
}
