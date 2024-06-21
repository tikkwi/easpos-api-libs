import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { EEntityMetadata } from '@common/utils/enum';
import { BaseSchema } from './base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Field } from './field.schema';
import { Permission } from './permission.schema';

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
