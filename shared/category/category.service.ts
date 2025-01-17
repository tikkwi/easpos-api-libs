import BaseService from '@common/core/base/base.service';
import Category from './category.schema';
import { CategoryDto, CategoryFindByIdDto } from './category.dto';
import AppService from '@common/decorator/app_service.decorator';
import { ModuleRef } from '@nestjs/core';

@AppService()
export default class CategoryService extends BaseService<Category> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }

   async findById({ ctx: { connection, session }, id, type }: CategoryFindByIdDto) {
      const repository = await this.getRepository(connection, session);
      return await repository.findOne({ filter: { _id: id, type } });
   }

   async getCategory({ ctx, _id, type, ...dto }: CategoryDto) {
      const repository = await this.getRepository(ctx.connection, ctx.session);
      if (_id) {
         const { data: category } = await this.findById({
            ctx,
            id: _id,
            type,
            errorOnNotFound: false,
         });
         if (category) return { data: category };
      }
      return await repository.create({ type, ...dto } as any);
   }
}
