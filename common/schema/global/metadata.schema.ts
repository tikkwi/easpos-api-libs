import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Field } from './field.schema';
import { BaseSchema } from '@common/schema/global/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { EEntityMetadata } from '@common/utils/enum';
import { Permission } from '@common/schema/global/permission.schema';

@Schema()
export class Metadata extends BaseSchema {
   @AppProp({ type: String, immutable: false })
   name: string;

   //NOTE: validate one entity can't have more than one metadata
   @AppProp({ type: String, enum: EEntityMetadata })
   entity: EEntityMetadata;

   @AppProp({ type: String, required: false, immutable: false })
   description?: string;

   @AppProp({ type: String, required: false, immutable: false })
   remark?: string;

   @AppProp({
      type: [{ type: SchemaTypes.ObjectId, ref: 'Field' }],
      immutable: false,
   })
   fields: Field[];

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Permission' }] })
   permissions: Permission[];
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);