import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { ValidateIf } from 'class-validator';

export class Product extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description: string;

   @AppProp({ type: String, unique: true })
   qrCode: string;

   @AppProp({ type: [String], required: false })
   attachments: string;

   @AppProp({ type: Boolean, required: false })
   nonDepleting: boolean;

   @ValidateIf((o) => !o.nonDepleting)
   @AppProp({ type: Number })
   numUnit: number;
}
