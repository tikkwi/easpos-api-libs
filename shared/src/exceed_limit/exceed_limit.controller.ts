import { AppController } from '@common/decorator/app_controller.decorator';
import { ExceedLimitService } from './exceed_limit.service';
import { EAllowedUser } from '@common/utils/enum';

@AppController('exceed-limit', [EAllowedUser.Admin])
export class ExceedLimitController {
  constructor(private readonly service: ExceedLimitService) {}
}
