import { AppController } from '@common/decorator/app_controller.decorator';
import { CategoryService } from './category.service';
import { CoreController } from '@common/core/core.controller';

@AppController('category')
export class CategoryController extends CoreController<CategoryService> {}
