import { REPOSITORY } from '@constant';
import { ContextService } from '@core/context/context.service';
import { CoreService } from '@core/service/core.service';
import { Repository } from '@core/repository';
import { AppService } from '@decorator/app_service.decorator';
import { FindByIdDto } from '@global_dto/core.dto';
import { BadRequestException, Inject } from '@nestjs/common';
import { CategoryServiceMethods, CreateCategoryDto } from '@shared/category/category.dto';
import { Category } from './category.schema';

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
