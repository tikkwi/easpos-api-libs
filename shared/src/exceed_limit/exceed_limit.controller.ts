import { AppController } from '@app/decorator';
import { ExceedLimitService } from './exceed_limit.service';
import { EAllowedUser } from '@app/helper';

@AppController('admin-api/exceed-limit', [EAllowedUser.Admin])
export class ExceedLimitController {
  constructor(private readonly service: ExceedLimitService) {}
}
