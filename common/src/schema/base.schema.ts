import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes, Types } from 'mongoose';

export class BaseSchema {
  @AppProp({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @AppProp({ type: Date, default: Date.now })
  createdAt: Date;

  @AppProp({ type: Date })
  updatedAt: Date;
}
