import { Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import ACoreService from '@common/core/core.service';
import Category from './category.schema';
import Repository from '@common/core/repository';
import AppService from '@common/decorator/app_service.decorator';
import { CategoryDto, CategoryFindByIdDto, CategoryFindByIdsDto } from './category.dto';

@AppService()
export default class CategoryService extends ACoreService<Category> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Category>) {
      super();
   }

   async findById({ id, type, errorOnNotFound = true, ...options }: CategoryFindByIdDto) {
      return this.repository.findOne({
         filter: { _id: id, type },
         options: { errorOnNotFound, ...options },
      });
   }

   async findByIds({ ids, type, errorOnNotFound = true, ...options }: CategoryFindByIdsDto) {
      const { data } = await this.repository.find({
         filter: { _id: { $in: ids }, type },
         options,
      });
      if (errorOnNotFound && data.length !== ids.length) throw new NotFoundException();
      return { data };
   }

   async getCategory({ id, type, ...dto }: CategoryDto) {
      return await (id ? this.findById({ id, type }) : this.repository.findOne({ filter: dto }));
   }
}
