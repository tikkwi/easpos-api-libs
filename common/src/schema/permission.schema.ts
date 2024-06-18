import { AppProp } from '@common/decorator';
import { BaseSchema } from '@common/schema';
import { SchemaFactory } from '@nestjs/mongoose';

export class Permission extends BaseSchema {
  @AppProp({ type: String }, { swagger: { example: 'ParcelStatus' } })
  name: string;

  @AppProp(
    { type: [{ type: String }] },
    {
      swagger: {
        example: [
          '/inventory/parcel/current-status',
          '/inventory/parcel/change-status',
        ],
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
