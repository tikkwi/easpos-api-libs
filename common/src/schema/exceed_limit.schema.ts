import { AppProp } from '@app/decorator';
import { Audit, ExceedLimitThreshold } from '@app/schema';
import { SchemaFactory } from '@nestjs/mongoose';
import { PickType } from '@nestjs/swagger';
import { SchemaTypes } from 'mongoose';

export class ExceedLimit extends PickType(Audit, [
  'submittedIP',
  'sessionId',
  'userAgent',
  'user',
  '_id',
  'createdAt',
  'updatedAt',
]) {
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
