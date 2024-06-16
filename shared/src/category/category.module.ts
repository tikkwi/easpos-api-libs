import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
//import { getRepositoryProviders } from '@app/helper';
import { Category, CategorySchema } from '@app/schema';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    // ...getRepositoryProviders([{ name: Category.name, schema: CategorySchema }]),
  ],
})
export class CategoryModule {}
