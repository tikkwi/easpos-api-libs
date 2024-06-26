import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Period } from '@common/dto/entity.dto';

@Schema()
export class ExceedLimitThreshold extends BaseSchema {
  @AppProp({ type: Boolean, default: false })
  isInitial?: boolean;

  @AppProp({ type: SchemaTypes.Mixed })
  @Type(() => Period)
  blockedUntil: Period;

  @AppProp({ type: String })
  remark?: string;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'ExceedLimitThreshold' })
  nextLimit?: ExceedLimitThreshold;
}

export const ExceedLimitThresholdSchema = SchemaFactory.createForClass(ExceedLimitThreshold);
