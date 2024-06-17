import { AppController } from '@common/decorator';
import { ExceedLimitService } from './exceed_limit.service';
import { EAllowedUser } from '@common/helper';

@AppController('admin-api/exceed-limit', [EAllowedUser.Admin])
export class ExceedLimitController {
  constructor(private readonly service: ExceedLimitService) {}
}
