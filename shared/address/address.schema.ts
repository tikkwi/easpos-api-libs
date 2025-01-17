import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import Category from '../category/category.schema';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';

@Schema()
export default class Address extends BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   locality: AppSchema<Category>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   administrativeArea: AppSchema<Category>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   stateProvince: AppSchema<Category>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   country: AppSchema<Category>;

   @AppProp({ type: Number }, { swagger: { example: 16.8661 } })
   latitude: number;

   @AppProp({ type: Number }, { swagger: { example: 96.1951 } })
   longitude: number;

   @AppProp(
      { type: String, required: false },
      { swagger: { example: 'No.123. Building A, Floor 3, Unit 5' } },
   )
   addressDetail?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
