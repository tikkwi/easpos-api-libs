import { AppProp } from '@common/decorator';
import { MetadataValue } from '@common/dto';
import { EStatus, EUser } from '@common/utils';
import { BaseSchema, Merchant, UserAppPermission } from '@common/schema';
import { SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';

export class User extends BaseSchema {
  @AppProp({ type: String, unique: true }, { userName: true })
  userName: string;

  @AppProp({ type: String, enum: EUser })
  type: EUser;

  @AppProp({
    type: String,
    enum: EStatus,
    default: EStatus.Pending,
    immutable: false,
  })
  status: EStatus;

  @AppProp({ type: String })
  firstName: string;

  @AppProp({ type: String })
  lastName: string;

  @AppProp({ type: String })
  @IsEmail()
  mail: string;

  @AppProp({
    type: String,
    set: async (pas) => await hash(pas, 16),
  })
  password: string;

  @AppProp({ type: SchemaTypes.Mixed })
  @Type(() => MetadataValue)
  metadata: MetadataValue;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
  @ValidateIf((o) => [EUser.Admin, EUser.Customer].includes(o.type))
  @IsNotEmpty()
  merchant?: Merchant;

  @AppProp({
    type: [{ type: SchemaTypes.ObjectId, ref: 'UserAppPermission' }],
    required: false,
    immutable: false,
  })
  appPermissions?: UserAppPermission[];
}

export const UserSchema = SchemaFactory.createForClass(User);
