import { SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';

export class Permission extends BaseSchema {
  @AppProp({ type: String }, { swagger: { example: 'ParcelStatus' } })
  name: string;

  @AppProp(
    { type: [{ type: String }] },
    {
      swagger: {
        example: ['/inventory/parcel/current-status', '/inventory/parcel/change-status'],
      },
    },
  )
  services: string[];

  @AppProp({ type: String, required: false, immutable: false })
  description?: string;

  @AppProp({ type: String, required: false, immutable: false })
  remark?: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
