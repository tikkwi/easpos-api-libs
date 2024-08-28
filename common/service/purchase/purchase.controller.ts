import { PurchaseService } from '@common/service/purchase/purchase.service';

export abstract class PurchaseController {
   protected abstract readonly service: PurchaseService;
}
