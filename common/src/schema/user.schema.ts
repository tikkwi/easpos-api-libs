import { AppProp } from '@common/decorator/app_prop.decorator';
import { EStatus, EUser } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Merchant } from './merchant.schema';
import { Permission } from './permission.schema';

@Schema()
export class User extends BaseSchema {
  @AppProp({ type: String }, { userName: true })
  userName: string;

  @AppProp({ type: String, enum: EUser, default: EUser.Merchant, required: false })
  type: EUser;

  @AppProp({
    type: String,
    enum: EStatus,
    default: EStatus.Pending,
    immutable: false,
  })
  status?: EStatus;

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

  @AppProp({ type: SchemaTypes.Mixed, required: false })
  metadata?: any;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant', required: false })
  @ValidateIf((o) => [EUser.Admin, EUser.Customer].includes(o.type))
  @IsNotEmpty()
  merchant?: Merchant;

  @AppProp({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Permission' }],
    required: false,
  })
  permissions?: Permission[];
}

export const UserSchema = SchemaFactory.createForClass(User);
