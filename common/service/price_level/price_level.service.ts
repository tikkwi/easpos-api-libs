import { CoreService } from '@common/core/service/core.service';
import { PriceLevel } from '@common/schema/price_level.schema';

export abstract class PriceLevelService<T extends PriceLevel = PriceLevel> extends CoreService<T> {
   abstract getPrice(dto: any): Promise<{ data: number }>;

   protected abstract getLevelAllowance(dto: any): Promise<{ amount: number; percentage: boolean }>;
}
