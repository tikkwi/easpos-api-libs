import { AppProp } from '@common/decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '@shared/category/category.schema';
import { SchemaTypes } from 'mongoose';
import { BaseSchema } from './base.schema';

@Schema()
export class Option extends BaseSchema {
  @AppProp({ type: String })
  name: string;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category: Category;

  @AppProp({ type: SchemaTypes.Mixed, required: false })
  metadata?: any;
}

export const OptionSchema = SchemaFactory.createForClass(Option);
