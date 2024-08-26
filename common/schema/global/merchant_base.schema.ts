import { BaseSchema } from '@common/schema/global/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Merchant } from '@common/schema/shared/merchant.schema';

export class MerchantBase extends BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}
