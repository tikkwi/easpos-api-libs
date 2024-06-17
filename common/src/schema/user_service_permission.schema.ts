import { AppProp } from '@common/decorator';
import { BaseSchema, Permission } from '@common/schema';
import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

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

export const UserServicePermissionSchema = SchemaFactory.createForClass(
  UserServicePermission,
);
