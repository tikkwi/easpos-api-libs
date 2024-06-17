import { SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@common/schema';
import { AppProp } from '@common/decorator';
import { ECategory } from '@common/helper';

export class Category extends BaseSchema {
  @AppProp({ type: String })
  name: string;

  @AppProp({ type: String, enum: ECategory })
  type: ECategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
