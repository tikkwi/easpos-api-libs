import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { BaseSchema, ExceedLimitThreshold } from '@common/schema';
import { AppProp } from '@common/decorator';
import { Type } from 'class-transformer';
import { Period } from '@common/dto';

export class AppConfig extends BaseSchema {
  @AppProp({ type: SchemaTypes.Mixed })
  @Type(() => Period)
  preEndSubMailPeriod: Period;

  @AppProp({
    type: [{ type: SchemaTypes.ObjectId, ref: 'ExceedLimitThreshold' }],
  })
  throttleThresholds: ExceedLimitThreshold[];
}

export const AppConfigSchema = SchemaFactory.createForClass(AppConfig);
