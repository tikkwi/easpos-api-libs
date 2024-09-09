import { BadRequestException } from '@nestjs/common';
import { Category } from '@common/schema/category.schema';
import { CoreService } from '@common/core/core.service';
import { CategoryDto } from '@common/dto/global/action.dto';

export abstract class CategoryService extends CoreService<Category> {
   async getCategory({ id, ...dto }: CategoryDto) {
      const existing = await this.repository.findOne({
         filter: dto,
      });
      if (existing) throw new BadRequestException('Already exist the category');
      return await (id
         ? this.repository.findOne({ id, errorOnNotFound: true })
         : super.create(dto as any));
   }
}
