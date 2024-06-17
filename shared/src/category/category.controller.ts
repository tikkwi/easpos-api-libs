import { AppController } from '@common/decorator';
import { CategoryService } from './category.service';

@AppController('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}
}
