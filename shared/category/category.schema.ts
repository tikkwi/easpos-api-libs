import { ECategory } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';

@Schema()
export default class Category extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: String, enum: ECategory })
   type: ECategory;

   @AppProp({ type: Boolean, default: false })
   isTag: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
