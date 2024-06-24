import { FindByIdDto } from '@common/dto/core.dto';
import { PartialType } from '@nestjs/swagger';
import { ExceedLimit } from '@shared/exceed_limit/exceed_limit.schema';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetLimitDto extends PartialType(FindByIdDto) {}

export class UnlimitRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export type ExceedLimitReturn = { data: ExceedLimit };

export interface ExceedLimitServiceMethods {
  getLimit(dto: GetLimitDto): Promise<ExceedLimitReturn>;
  limitRequest(): Promise<ExceedLimitReturn>;
  unlimitRequest(dto: UnlimitRequestDto): Promise<ExceedLimitReturn>;
}
