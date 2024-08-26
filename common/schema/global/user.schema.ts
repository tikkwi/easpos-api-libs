import { SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { Type } from 'class-transformer';
import {
   IsDateString,
   IsEmail,
   IsEnum,
   IsOptional,
   IsPhoneNumber,
   IsString,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Address } from '@common/schema/global/address.schema';
import { EStatus, ETmpBlock, EUser } from '@common/utils/enum';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { MFA, Status } from '@common/dto/global/entity.dto';

export class TmpBlock {
   @IsDateString()
   until: Date;

   @IsEnum(ETmpBlock)
   type: ETmpBlock;

   @IsOptional()
   @IsString()
   remark?: string;
}

export class User extends BaseSchema {
   @AppProp({ type: String, unique: true }, { userName: true })
   userName: string;

   @AppProp({ type: String, enum: EUser, default: EUser.Merchant, required: false })
   type: EUser;

   @AppProp({ type: SchemaTypes.Mixed, immutable: false, default: { status: EStatus.Pending } })
   @Type(() => Status)
   status?: Status;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => TmpBlock)
   tmpBlock?: TmpBlock;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => MFA)
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
   address?: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
