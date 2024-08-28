import { CoreService } from '@common/core/service/core.service';
import { Purchase } from '@common/schema/purchase.schema';

export abstract class PurchaseService extends CoreService<Purchase> {}
