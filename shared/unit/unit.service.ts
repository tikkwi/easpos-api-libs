import { BadRequestException, Inject } from '@nestjs/common';
import Unit from './unit.schema';
import ACoreService from '@common/core/core.service';
import { ExchangeUnitDto, GetBaseUnitDto } from './unit.dto';
import AppService from '@common/decorator/app_service.decorator';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';

@AppService()
export default class UnitService extends ACoreService<Unit> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Unit>) {
      super();
   }

   async getBase({ unitId, categoryId }: GetBaseUnitDto) {
      const findBase = async (catId: string) =>
         this.repository.findOne({
            filter: { isBase: true, category: catId },
            errorOnNotFound: true,
         });

      if (categoryId) return await findBase(categoryId);
      else {
         const { data: unit } = await this.repository.findOne({
            id: unitId,
            errorOnNotFound: true,
         });
         return await findBase(unit.category as any);
      }
   }

   async exchangeUnit({ current, targetId }: ExchangeUnitDto) {
      let exchanged = 0;
      let target,
         targetAmount = 1;
      if (targetId) {
         const { data } = await this.repository.findOne({
            filter: { _id: targetId },
            errorOnNotFound: true,
         });
         target = data;
         targetAmount = data.baseUnit;
      }
      for (const { amount, unitId } of current) {
         if (unitId) {
            const { data } = await this.repository.findOne({
               filter: { _id: unitId },
               errorOnNotFound: true,
            });

            if (
               target &&
               (target.isCurrency !== data.isCurrency || !target.category.equals(data.category))
            )
               throw new BadRequestException('Invalid unit');
            exchanged += data.baseUnit * amount;
         } else exchanged += amount;
      }

      return {
         data: exchanged / targetAmount,
      };
   }
}
