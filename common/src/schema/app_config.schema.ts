import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { BaseSchema, ExceedLimitThreshold } from '@app/schema';
import { AppProp } from '@app/decorator';
import { Type } from 'class-transformer';
import { Period } from '@app/dto';

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
