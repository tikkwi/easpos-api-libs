import { CoreService } from '@common/core/service/core.service';
import { PriceLevel } from '@common/schema/price_level.schema';

export abstract class PriceLevelService extends CoreService<PriceLevel> {
   abstract getPrice(dto: any): Promise<{ data: number }>;
}
