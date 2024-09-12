import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import AppService from '@common/decorator/app_service.decorator';
import CoreService from '@common/core/core.service';
import Currency from './currency.schema';
import Repository from '@common/core/repository';

@AppService()
export default class CurrencyService extends CoreService<Currency> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Currency>) {
      super();
   }
}
