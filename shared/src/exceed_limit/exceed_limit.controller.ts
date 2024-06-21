import { AppController } from '@common/decorator/app_controller.decorator';
import { ExceedLimitService } from './exceed_limit.service';
import { CoreController } from '@common/core/core.controller';
import { EAllowedUser } from '@common/utils/enum';

@AppController('exceed-limit', [EAllowedUser.Admin])
export class ExceedLimitController extends CoreController<ExceedLimitService> {}
