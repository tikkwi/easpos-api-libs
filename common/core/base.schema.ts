import { SchemaTypes } from 'mongoose';
import { EApp } from '@common/utils/enum';
import AppProp from '../decorator/app_prop.decorator';

export default class BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, auto: true })
   _id: ObjectId;

   @AppProp({ type: Date, default: Date.now })
   createdAt: Date;

   @AppProp({ type: Date, required: false })
   updatedAt: Date;

   @AppProp({ type: String, enum: EApp })
   app: EApp;
}
