import { AppProp } from '@common/decorator';
import { Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema()
export class BaseSchema {
  @AppProp({ type: SchemaTypes.ObjectId, auto: true })
  _id: ObjectId;

  @AppProp({ type: Date, default: Date.now })
  createdAt: Date;

  @AppProp({ type: Date })
  updatedAt: Date;
}
