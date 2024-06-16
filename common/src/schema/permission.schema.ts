import { AppProp } from '@app/decorator';
import { BaseSchema } from '@app/schema';
import { SchemaFactory } from '@nestjs/mongoose';

export class Permission extends BaseSchema {
  @AppProp({ type: String }, { swagger: { example: 'UserApi' } })
  app: string;

  @AppProp({ type: String }, { swagger: { example: 'Permission' } })
  service: string;

  @AppProp({ type: String }, { swagger: { example: 'Update' } })
  auxillaryService: string;

  @AppProp({ type: String, required: false, immutable: false })
  description?: string;

  @AppProp({ type: String, required: false, immutable: false })
  remark?: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
