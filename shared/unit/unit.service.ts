import { BadRequestException, Inject } from '@nestjs/common';
import Unit from './unit.schema';
import CoreService from '@common/core/core.service';
import { CreateUnitDto, ExchangeUnitDto } from './unit.dto';
import AppService from '@common/decorator/app_service.decorator';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { ECategory } from '@common/utils/enum';

@AppService()
export default class UnitService extends CoreService<Unit> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Unit>) {
      super();
   }

   async getBase() {
      return await this.repository.findOne({ filter: { base: true } });
   }

   async createUnit({ category, ...dto }: CreateUnitDto) {
      if (dto.base) {
         const base = await this.getBase();
         if (base) throw new BadRequestException('There is already a base unit');
      }
      return super.create({ ...dto, category: { ...category, type: ECategory.Unit } });
   }

   async exchangeUnit({ current, targetId }: ExchangeUnitDto) {
      let exchanged = 0;
      let target = 1;
      if (targetId) {
         ({
            data: { baseUnit: target },
         } = await this.findById({ id: targetId, errorOnNotFound: true }));
      }
      for (const { amount, currencyId } of current) {
         const {
            data: { baseUnit },
         } = await this.findById({
            id: currencyId,
            errorOnNotFound: true,
         });
         exchanged += baseUnit * amount;
      }

      return exchanged / target;
   }
}
