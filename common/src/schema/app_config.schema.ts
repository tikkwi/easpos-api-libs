import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { ExceedLimitThreshold } from '@shared/exceed_limit/exceed_limit_threshold.schema';
import { BaseSchema } from './base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { Period } from '@common/dto/entity.dto';

@Schema()
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
