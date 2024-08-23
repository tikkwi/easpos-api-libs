import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { AppProp } from '@decorator/app_prop.decorator';
import { IsUrl } from 'class-validator';

@Schema()
export class Permission extends BaseSchema {
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
