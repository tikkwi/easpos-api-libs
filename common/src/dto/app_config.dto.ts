import { PartialType, PickType } from '@nestjs/swagger';
import { ExceedLimitThreshold } from '@shared/exceed_limit/exceed_limit_threshold.schema';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';

class ThresholdDto extends PickType(ExceedLimitThreshold, ['blockedUntil', 'remark']) {}

export class UpdateThresholdDto extends PartialType(ThresholdDto) {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsBoolean()
  isLastThreshold?: boolean;

  @ValidateNested()
  @Type(() => ThresholdDto)
  nextThreshold?: ThresholdDto;
}

export type AppConfigReturn = { data: AppConfig };

export interface AppConfigServiceMethods {
  getConfig(): Promise<AppConfigReturn>;
}
