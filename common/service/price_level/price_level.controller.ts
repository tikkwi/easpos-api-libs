import { CoreController } from '@common/core/core.controller';
import { PriceLevelService } from '@common/service/price_level/price_level.service';

export abstract class PriceLevelController extends CoreController {
   protected abstract service: PriceLevelService;
}
