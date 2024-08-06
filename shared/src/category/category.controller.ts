import { AppController } from '@common/decorator/app_controller.decorator';
import { CategoryService } from './category.service';
import { Body, Post } from '@nestjs/common';
import { CreateCategoryDto } from './category.dto';

@AppController('category')
export class CategoryController {
   constructor(private readonly service: CategoryService) {}

   @Post('create')
   async createCategory(@Body() dto: CreateCategoryDto) {
      return this.service.createCategory(dto);
   }
}
