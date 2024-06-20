import { AppController } from '@common/decorator';
import { ExceedLimitService } from './exceed_limit.service';
import { CoreController } from '@common/core/core.controller';
import { EAllowedUser } from '@common/utils';

@AppController('exceed-limit', [EAllowedUser.Admin])
export class ExceedLimitController extends CoreController {
  constructor(service: ExceedLimitService) {
    super(service);
  }
}
