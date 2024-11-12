import { BadRequestException, Inject } from '@nestjs/common';
import Unit from './unit.schema';
import ACoreService from '@common/core/core.service';
import { CreateUnitDto, ExchangeUnitDto } from './unit.dto';
import AppService from '@common/decorator/app_service.decorator';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { ECategory } from '@common/utils/enum';

@AppService()
export default class UnitService extends ACoreService<Unit> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Unit>) {
      super();
   }

   async getBase() {
      return await this.repository.findOne({ filter: { base: true } });
   }

   async createUnit({ category, ...dto }: CreateUnitDto, currency = false) {
      if (dto.base) {
         const base = await this.getBase();
         if (base) throw new BadRequestException('There is already a base unit');
      }
      return super.create({ ...dto, currency, category: { ...category, type: ECategory.Unit } });
   }

   async exchangeUnit({ current, targetId, currency, categoryId }: ExchangeUnitDto) {
      let exchanged = 0;
      let target = 1;
      if (targetId) {
         ({
            data: { baseUnit: target },
         } = await this.repository.findOne({
            filter: { _id: targetId, currency, category: categoryId },
            errorOnNotFound: true,
         }));
      }
      for (const { amount, unitId } of current) {
         const {
            data: { baseUnit },
         } = await this.repository.findOne({
            filter: { _id: unitId, currency, category: categoryId },
            errorOnNotFound: true,
         });
         exchanged += baseUnit * amount;
      }

      return exchanged / target;
   }
}
