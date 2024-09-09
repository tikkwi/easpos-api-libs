import { CoreService } from '@common/core/core.service';
import { CreateUnitDto, ExchangeUnitDto } from '@common/dto/service/unit.dto';
import { BadRequestException } from '@nestjs/common';
import { Unit } from '@common/schema/unit.schema';
import { CategoryService } from '@common/service/category/category.service';

export abstract class UnitService<T extends Unit = Unit> extends CoreService<T> {
   protected categoryService: CategoryService; //can't abstract coz don't need in currency

   async getBase() {
      return await this.repository.findOne({ filter: { base: true } });
   }

   async create<C extends CreateUnitDto>({ categoryDto, ...dto }: C) {
      if (dto.base) {
         const base = await this.getBase();
         if (base) throw new BadRequestException('There is already a base unit');
      }
      return super.create(undefined, async () => {
         if (dto.base) {
            const base = await this.getBase();
            if (base) throw new BadRequestException('There is already a base unit');
         }
         const category = await this.categoryService.getCategory(categoryDto);
         return { ...dto, category } as any;
      });
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
