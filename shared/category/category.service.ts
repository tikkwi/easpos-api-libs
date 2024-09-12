import { BadRequestException, Inject } from '@nestjs/common';
import { CreateCategoryDto } from '@common/dto/action.dto';
import { REPOSITORY } from '@common/constant';
import CoreService from '@common/core/core.service';
import Category from './category.schema';
import Repository from '@common/core/repository';
import AppService from '@common/decorator/app_service.decorator';

@AppService()
export default class CategoryService extends CoreService<Category> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Category>) {
      super();
   }

   async getCategory({ id, ...dto }: CreateCategoryDto) {
      const existing = await this.repository.findOne({
         filter: dto,
      });
      if (existing) throw new BadRequestException('Already exist the category');
      return await (id
         ? this.repository.findOne({ id, errorOnNotFound: true })
         : super.create(dto as any));
   }
}
