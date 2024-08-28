import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Category } from '@common/schema/category.schema';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Status } from '@common/dto/global/entity.dto';

export class Campaign extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: Date })
   startDate: Date;

   @AppProp({ type: Date })
   endDate: Date;

   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: String, required: false })
   terms?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
   type?: Category;
}
