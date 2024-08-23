import { AppProp } from '@decorator/app_prop.decorator';
import { BaseSchema } from '@global_schema/base.schema';
import { ECategory } from '@utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Category extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, enum: ECategory })
   type: ECategory;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
