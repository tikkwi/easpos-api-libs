import { CategoryService } from '@common/service/category/category.service';

export abstract class CategoryController {
   protected abstract service: CategoryService;
}
