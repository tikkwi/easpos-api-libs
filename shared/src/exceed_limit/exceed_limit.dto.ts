import { BaseDto, FindDto } from '@common/dto/core.dto';
import { IntersectionType } from '@nestjs/swagger';
import { ExceedLimit } from '@shared/exceed_limit/exceed_limit.schema';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetLimitDto extends IntersectionType(BaseDto, FindDto) {
  id?: string;
}

export class UnlimitRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export type ExceedLimitReturn = { data: ExceedLimit };

export interface ExceedLimitServiceMethods {
  getLimit(dto: GetLimitDto): Promise<ExceedLimitReturn>;
  limitRequest(dto: BaseDto): Promise<ExceedLimitReturn>;
  unlimitRequest(dto: UnlimitRequestDto): Promise<ExceedLimitReturn>;
}
