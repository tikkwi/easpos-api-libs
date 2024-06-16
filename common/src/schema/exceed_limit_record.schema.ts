import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { User } from '@app/dto';
import { AppProp } from '@app/decorator';
import { BaseSchema, ExceedLimit, ExceedLimitThreshold } from '@app/schema';

export class ExceedLimitRecord extends BaseSchema {
  @AppProp({ type: Boolean, default: true })
  blocked?: boolean;

  @AppProp({ type: SchemaTypes.Mixed, required: false })
  @Type(() => User)
  adjudicatedBy?: User;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'ExceedLimit' })
  exceedLimit: ExceedLimit;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'ExceedLimitThreshold' })
  threshold?: ExceedLimitThreshold;
}

export const ExceedLimitRecordSchema =
  SchemaFactory.createForClass(ExceedLimitRecord);
