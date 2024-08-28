import { BadRequestException } from '@nestjs/common';
import { Category } from '@common/schema/category.schema';
import { CoreService } from '@common/core/service/core.service';
import { Repository } from '@common/core/repository';
import { CategoryDto } from '@common/dto/global/action.dto';

export abstract class CategoryService extends CoreService<Category> {
   protected abstract readonly repository: Repository<Category>;

   async getCategory({ id, ...dto }: CategoryDto) {
      const existing = await this.repository.findOne({
         filter: { name: dto.name, type: dto.type },
      });
      if (existing) throw new BadRequestException('Already exist the category');
      return await (id
         ? this.repository.findOne({ id, errorOnNotFound: true })
         : super.create(dto));
   }
}
