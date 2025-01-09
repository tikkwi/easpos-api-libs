import { BadRequestException } from '@nestjs/common';
import Unit from './unit.schema';
import BaseService from '@common/core/base/base.service';
import { CreateUnitDto, ExchangeUnitDto, GetBaseUnitDto } from './unit.dto';
import AppService from '@common/decorator/app_service.decorator';
import CategoryService from '../category/category.service';

@AppService()
export default class UnitService extends BaseService<Unit> {
   constructor(private readonly categoryService: CategoryService) {
      super();
   }

   async getBase({ connection, session }: RequestContext, { unitId, categoryId }: GetBaseUnitDto) {
      const repository = await this.getRepository(connection, session);
      const findBase = async (catId: string) =>
         repository.findOne({
            filter: { isBase: true, category: catId },
            errorOnNotFound: true,
         });

      if (categoryId) return await findBase(categoryId);
      else {
         const { data: unit } = await repository.findOne({
            id: unitId,
            errorOnNotFound: true,
         });
         return await findBase(unit.category as any);
      }
   }

   async exchangeUnit(
      { connection, session }: RequestContext,
      { current, targetId }: ExchangeUnitDto,
   ) {
      const repository = await this.getRepository(connection, session);
      let exchanged = 0;
      let target,
         targetAmount = 1;
      if (targetId) {
         const { data } = await repository.findOne({
            filter: { _id: targetId },
            errorOnNotFound: true,
         });
         target = data;
         targetAmount = data.baseUnit;
      }
      for (const { amount, unitId } of current) {
         if (unitId) {
            const { data } = await repository.findOne({
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

   async createUnit(ctx: RequestContext, { category: catDto, ...dto }: CreateUnitDto) {
      const { data: category } = await this.categoryService.getCategory(ctx, catDto);
      const repository = await this.getRepository(ctx.connection, ctx.session);
      return repository.create({ ...dto, category });
   }
}
