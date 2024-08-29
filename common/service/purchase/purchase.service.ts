import { CoreService } from '@common/core/service/core.service';
import { Purchase } from '@common/schema/purchase.schema';

export abstract class PurchaseService<T extends Purchase = Purchase> extends CoreService<T> {}
