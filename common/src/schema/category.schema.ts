import { SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@app/schema';
import { AppProp } from '@app/decorator';
import { ECategory } from '@app/helper';

export class Category extends BaseSchema {
  @AppProp({ type: String })
  name: string;

  @AppProp({ type: String, enum: ECategory })
  type: ECategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
