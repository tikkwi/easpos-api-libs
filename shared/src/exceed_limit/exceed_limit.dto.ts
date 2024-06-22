import { BaseDto, FindDto } from '@common/dto/core.dto';
import { IntersectionType } from '@nestjs/swagger';
import { ExceedLimit } from '@shared/exceed_limit/exceed_limit.schema';
import { IsMongoId } from 'class-validator';

export class GetLimitDto extends IntersectionType(BaseDto, FindDto) {
  id?: string;
}

export class UnlimitRequestDto extends BaseDto {
  @IsMongoId()
  id?: string;
}

export type ExceedLimitReturn = { data: ExceedLimit };

export interface ExceedLimitServiceMethods {
  getLimit(dto: GetLimitDto): Promise<ExceedLimitReturn>;
  limitRequest(dto: BaseDto): Promise<ExceedLimitReturn>;
  unlimitRequest(dto: UnlimitRequestDto): Promise<ExceedLimitReturn>;
}
