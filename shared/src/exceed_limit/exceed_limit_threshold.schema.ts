import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Period } from '@common/dto';
import { AppProp } from '@common/decorator';
import { BaseSchema } from '@common/schema';

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

export const ExceedLimitThresholdSchema =
  SchemaFactory.createForClass(ExceedLimitThreshold);
