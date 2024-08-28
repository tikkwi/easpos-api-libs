import { CoreController } from '@common/core/core.controller';
import { Body, Post } from '@nestjs/common';
import { CreateCategoryDto } from '@common/dto/global/category.dto';

export abstract class CategoryController extends CoreController {
   @Post('create')
   async createCategory(@Body() dto: CreateCategoryDto) {
      return this.service.create(dto);
   }
}
