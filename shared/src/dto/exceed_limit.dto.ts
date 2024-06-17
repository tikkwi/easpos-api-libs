import { FindDto } from '@common/dto';
import { ExceedLimit } from '@shared/exceed_limit/exceed_limit.schema';
import { IsMongoId } from 'class-validator';
import { Request } from 'express';

export class GetLimitDto extends FindDto {
  id?: string;
}

export class UnlimitRequestDto {
  @IsMongoId()
  id?: string;
}

export type ExceedLimitReturn = { data: ExceedLimit };

export interface ExceedLimitServiceMethods {
  getLimit(request: Request, dto?: GetLimitDto): Promise<ExceedLimitReturn>;
  limitRequest(request: Request): Promise<ExceedLimitReturn>;
  unlimitRequest(dto: UnlimitRequestDto): Promise<ExceedLimitReturn>;
}
