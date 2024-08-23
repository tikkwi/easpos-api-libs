import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Matches, ValidateIf } from 'class-validator';
import { EField } from '@utils/enum';
import { BaseSchema } from '@global_schema/base.schema';
import { AppProp } from '@decorator/app_prop.decorator';
import { regex } from '@utils/regex';

@Schema()
export class Field extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, enum: EField })
   type: EField;

   @ValidateIf((o) => o.type == EField.Enum) //NOTE: must be array of values [A, B, C, D] etc.,
   @AppProp({ type: [{ type: String }] }, { validateString: false })
   @Matches(regex.enum, { each: true })
   enum?: string[];

   @AppProp({ type: Boolean, default: false })
   isOptional: boolean;

   @AppProp({ type: Boolean, default: false })
   isArray: boolean;

   @AppProp({ type: String, required: false })
   remark?: string;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
