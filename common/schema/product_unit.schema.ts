import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Product } from '@common/schema/product.schema';
import { IntersectionType, PickType } from '@nestjs/swagger';

/*
 * TODO:
 * product_unit schema in user app will need specific fields like serial_no, exp_date, batch etc.
 * */
export abstract class ProductUnit extends IntersectionType(
   BaseSchema,
   PickType(Product, ['qrCode', 'attachments', 'numUnit']),
) {
   abstract product: Product;

   @AppProp({ type: String, required: false })
   remark?: string;
}
