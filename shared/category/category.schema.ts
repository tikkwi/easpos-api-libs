import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '@common/schema/global/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { ECategory } from '@common/utils/enum';

@Schema()
export class Category extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, enum: ECategory })
   type: ECategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
