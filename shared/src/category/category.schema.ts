import { AppProp } from '@common/decorator/app_prop.decorator';
import { BaseSchema } from '@common/schema/base.schema';
import { ECategory } from '@common/utils/enum';
import { SchemaFactory } from '@nestjs/mongoose';

export class Category extends BaseSchema {
  @AppProp({ type: String })
  name: string;

  @AppProp({ type: String, enum: ECategory })
  type: ECategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
