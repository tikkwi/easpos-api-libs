import { GrpcHandler } from '@app/decorator';
import { BaseDto } from '@app/dto';
import { GetLimitDto, UnlimitRequestDto } from './exceed_limit.dto';
import { ExceedLimitService } from './exceed_limit.service';

@GrpcHandler()
export class ExceedLimitGrpcController {
  constructor(private readonly service: ExceedLimitService) {}

  async getLimit(dto: GetLimitDto) {
    return this.service.getLimit(dto);
  }

  async limitRequest(dto: BaseDto) {
    return this.service.limitRequest(dto);
  }

  async unlimitRequest(dto: UnlimitRequestDto) {
    return this.service.unlimitRequest(dto);
  }
}
