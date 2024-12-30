import BaseService from '@common/core/base/base.service';
import Category from './category.schema';
import { CategoryDto, CategoryFindByIdDto } from './category.dto';
import AppService from '@common/decorator/app_service.decorator';

@AppService()
export default class CategoryService extends BaseService<Category> {
   async findById({ id, type }: CategoryFindByIdDto) {
      const repository = await this.getRepository();
      return await repository.findOne({ filter: { _id: id, type } });
   }

   async getCategory({ id, type, ...dto }: CategoryDto) {
      const repository = await this.getRepository();
      return await (id ? this.findById({ id, type }) : repository.findOne({ filter: dto }));
   }
}
