import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Category } from '@common/schema/category.schema';
import { Type } from 'class-transformer';
import { Status } from '@common/dto/global/entity.dto';
import { EExpenseScope } from '@common/utils/enum';
import { ValidateIf } from 'class-validator';
import { Product } from '@common/schema/product.schema';

export class Expense extends BaseSchema {
   @AppProp({ type: String, required: false })
   voucherId?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: Number })
   amount: number;

   @AppProp({ type: Number }) //Inclusive
   taxAmount?: number;

   @AppProp({ type: Boolean })
   isTax: boolean;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: String, required: false })
   remark?: string;

   @AppProp({ type: [String] })
   attachments?: string[];

   @AppProp({ type: String, enum: EExpenseScope })
   scope: EExpenseScope;

   @ValidateIf((o) => o.scope === EExpenseScope.ProductCategory)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   eftProdCategories: Category[];

   @ValidateIf((o) => o.scope === EExpenseScope.ProductTag)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   eftProdTags: Category[];

   @ValidateIf((o) => o.scope === EExpenseScope.WholeProduct)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Product' }] })
   eftWhlProds: Product[];

   @ValidateIf((o) => o.scope === EExpenseScope.WholeProduct)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Product' }] })
   eftPerUntProds: Product[];
}
