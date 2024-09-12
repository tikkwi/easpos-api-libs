import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Category, { CategorySchema } from './category.schema';
import { getRepositoryProvider } from '@common/utils/misc';
import CategoryService from './category.service';
import CategoryController from './category.controller';

@Global()
@Module({
   imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
   controllers: [CategoryController],
   providers: [CategoryService, getRepositoryProvider({ name: Category.name })],
   exports: [CategoryService],
})
export default class CategoryModule {}
