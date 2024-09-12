import { IsUrl } from 'class-validator';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export default class Permission extends BaseSchema {
   @AppProp({ type: String }, { swagger: { example: 'Parcel Status' } })
   name: string;

   @AppProp(
      { type: String },
      { validateString: false, swagger: { example: '/inventory/parcel/current-status' } },
   )
   @IsUrl()
   url: string;

   @AppProp({ type: String, required: false, immutable: false })
   description?: string;

   @AppProp({ type: String, required: false, immutable: false })
   remark?: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
