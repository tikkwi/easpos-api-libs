import { AppProp } from '@common/decorator';
import { BaseSchema } from '@common/schema';
import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { UserServicePermission } from '@common/schema';

export class UserAppPermission extends BaseSchema {
  @AppProp({ type: String })
  app: string;

  @AppProp({ type: Boolean, default: false, immutable: false })
  allowAll: boolean;

  @AppProp({
    type: [{ type: SchemaTypes.ObjectId, ref: 'UserServicePermission' }],
    required: false,
  })
  services?: UserServicePermission[];
}

export const UserAppPermissionSchema =
  SchemaFactory.createForClass(UserAppPermission);
