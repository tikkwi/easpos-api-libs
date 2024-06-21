import { AppProp } from '@common/decorator/app_prop.decorator';
import { BaseSchema } from '@common/schema/base.schema';
import { SchemaFactory } from '@nestjs/mongoose';

export class Address extends BaseSchema {
  @AppProp({ type: String }, { swagger: { example: 'Hlaing' } })
  city: string;

  @AppProp({ type: String, required: false }, { swagger: { example: 'Bogyoke Road' } })
  street?: string;

  @AppProp({ type: String, required: false }, { swagger: { example: 'DuuYar' } })
  village?: string;

  @AppProp({ type: String }, { swagger: { example: 'Yangon' } })
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
  addressDetail: number;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
