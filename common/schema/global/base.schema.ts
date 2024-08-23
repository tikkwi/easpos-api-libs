import { AppProp } from '@decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';

export class BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, auto: true })
   _id: ObjectId;

   @AppProp({ type: Date, default: Date.now })
   createdAt: Date;

   @AppProp({ type: Date, required: false })
   updatedAt: Date;
}
