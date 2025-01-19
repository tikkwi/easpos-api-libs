import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Category from '../category/category.schema';
import Permission from '../permission/permission.schema';

@Schema()
export default class PermissionTag {
   //tag
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   tag: Category;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Permission' }], default: [] })
   permissions: Array<Permission>;
}

export const PermissionTagSchema = SchemaFactory.createForClass(PermissionTag);
