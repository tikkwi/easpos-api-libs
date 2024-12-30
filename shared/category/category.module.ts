import { Global, Module } from '@nestjs/common';
import { CategorySchema } from './category.schema';
import CategoryService from './category.service';
import CategoryController from './category.controller';
import { SCHEMA } from '@common/constant';

@Global()
@Module({
   providers: [CategoryService, { provide: SCHEMA, useValue: CategorySchema }],
   controllers: [CategoryController],
   exports: [CategoryService],
})
export default class CategoryModule {}
