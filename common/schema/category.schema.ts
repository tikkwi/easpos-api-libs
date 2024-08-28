import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { ECategory } from '@common/utils/enum';

export class Category extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, enum: ECategory })
   type: ECategory;
}
