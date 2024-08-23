import { AppProp } from '@decorator/app_prop.decorator';
import { BaseSchema } from '@global_schema/base.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Address extends BaseSchema {
   @AppProp({ type: String }, { swagger: { example: 'Zalun' } })
   locality: string;

   @AppProp({ type: String, required: false }, { swagger: { example: 'Hinthada' } })
   administrativeArea?: string;

   @AppProp({ type: String }, { swagger: { example: 'Ayeyarwady' } })
   stateProvince: string;

   @AppProp({ type: String }, { swagger: { example: 'Myanmar' } })
   country: string;

   @AppProp({ type: Number }, { swagger: { example: 16.8661 } })
   latitude: number;

   @AppProp({ type: Number }, { swagger: { example: 96.1951 } })
   longitude: number;

   @AppProp(
      { type: String, required: false },
      { swagger: { example: 'No.123. Building A, Floor 3, Unit 5' } },
   )
   addressDetail?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
