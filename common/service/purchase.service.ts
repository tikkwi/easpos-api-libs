import { CoreService } from '@common/core/service/core.service';
import { Purchase } from '@common/schema/purchase.schema';
import { PriceLevelService } from '@common/service/price_level.service';

export abstract class PurchaseService<T extends Purchase = Purchase> extends CoreService<T> {
   protected abstract priceLevelService: PriceLevelService;

   abstract getPrice(dto: any): Promise<{ data: number }>;
}
