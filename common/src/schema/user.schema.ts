import { AppProp } from '@common/decorator/app_prop.decorator';
import { Status } from '@common/dto/entity.dto';
import { EStatus, ETmpBlock, EUser } from '@common/utils/enum';
import { SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { Type } from 'class-transformer';
import {
   IsDateString,
   IsEmail,
   IsEnum,
   IsNumberString,
   IsOptional,
   IsPhoneNumber,
   IsString,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Address } from '@shared/address/address.schema';

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

   @AppProp({ type: String, required: false })
   @IsNumberString()
   mfa?: string;

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
