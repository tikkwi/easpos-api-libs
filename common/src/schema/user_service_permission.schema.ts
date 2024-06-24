import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { BaseSchema } from './base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Permission } from './permission.schema';

@Schema()
export class UserServicePermission extends BaseSchema {
  @AppProp({ type: String })
  service: string;

  @AppProp({ type: Boolean, default: false, immutable: false })
  allowAll: boolean;

  @AppProp({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Permission' }],
    required: false,
  })
  permissions: Permission[];
}

export const UserServicePermissionSchema = SchemaFactory.createForClass(UserServicePermission);
