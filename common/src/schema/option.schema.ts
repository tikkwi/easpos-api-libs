import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Category } from '@shared/category/category.schema';
import { BaseSchema } from './base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { MetadataValue } from '@common/dto/entity.dto';

@Schema()
export class Option extends BaseSchema {
  @AppProp({ type: String })
  name: string;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category: Category;

  @AppProp({ type: SchemaTypes.Mixed })
  @Type(() => MetadataValue)
  metadata: MetadataValue;
}

export const OptionSchema = SchemaFactory.createForClass(Option);
