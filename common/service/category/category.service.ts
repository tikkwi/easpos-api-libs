import { BadRequestException, Inject } from '@nestjs/common';
import { CategoryServiceMethods, CreateCategoryDto } from '@common/dto/global/category.dto';
import { Category } from '@common/schema/category.schema';
import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { ContextService } from '@common/core/context/context.service';
import { FindByIdDto } from '@common/dto/global/core.dto';

@AppService()
export class CategoryService extends CoreService implements CategoryServiceMethods {
   constructor(
      @Inject(REPOSITORY) private readonly repository: Repository<Category>,
      protected readonly context: ContextService,
   ) {
      super();
   }

   async getCategory(dto: FindByIdDto) {
      return await this.repository.findOne(dto);
   }

   async createCategory(dto: CreateCategoryDto) {
      const existing = await this.repository.findOne({
         filter: { name: dto.name, type: dto.type },
      });
      if (existing) throw new BadRequestException('Already exist the category');
      return await this.repository.create(dto);
   }
}
