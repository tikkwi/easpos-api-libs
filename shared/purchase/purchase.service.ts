import AppService from '@common/decorator/app_service.decorator';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import CoreService from '@common/core/core.service';
import Purchase from './purchase.schema';
import { v4 } from 'uuid';
import { EStatus } from '@common/utils/enum';
import { CreatePurchaseDto } from './purchase.dto';

@AppService()
export default class PurchaseService extends CoreService<Purchase> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Purchase>) {
      super();
   }

   async createPurchase(dto: CreatePurchaseDto) {
      const voucherId = v4();
      return await super.create({ ...dto, voucherId, status: { status: EStatus.Pending } });
   }
}
