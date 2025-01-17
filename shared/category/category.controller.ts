import AppController from '@common/decorator/app_controller.decorator';
import CategoryService from './category.service';
import { Body, Post, Req } from '@nestjs/common';
import { CreateCategoryDto } from './category.dto';
import { Request } from 'express';

@AppController('category')
// @AppController('category', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class CategoryController {
   constructor(protected readonly service: CategoryService) {}

   @Post('create')
   async createCategory(@Body() dto: CreateCategoryDto, @Req() { ctx }: Request) {
      return this.service.getCategory({ ctx, ...dto });
   }
}
