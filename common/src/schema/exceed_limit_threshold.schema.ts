import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Period } from '@app/dto';
import { AppProp } from '@app/decorator';
import { BaseSchema } from '@app/schema';

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
