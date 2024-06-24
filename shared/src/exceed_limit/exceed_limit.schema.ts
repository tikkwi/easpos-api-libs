import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { Audit } from '@shared/audit/audit.schema';
import { SchemaTypes } from 'mongoose';
import { ExceedLimitThreshold } from './exceed_limit_threshold.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { BaseSchema } from '@common/schema/base.schema';

@Schema()
export class ExceedLimit extends IntersectionType(
  BaseSchema,
  PickType(Audit, ['submittedIP', 'sessionId', 'userAgent', 'user']),
) {
  @AppProp({ type: Boolean, default: true, immutable: false })
  blocked?: boolean;

  @AppProp({
    type: SchemaTypes.ObjectId,
    ref: 'ExceedLimitThreshold',
    immutable: false,
  })
  threshold?: ExceedLimitThreshold;
}

export const ExceedLimitSchema = SchemaFactory.createForClass(ExceedLimit);
