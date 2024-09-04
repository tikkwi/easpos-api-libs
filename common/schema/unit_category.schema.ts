import { Category } from '@common/schema/category.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';

export class UnitCategory extends Category {
   @AppProp({ type: Boolean, default: false })
   default: boolean;
}
