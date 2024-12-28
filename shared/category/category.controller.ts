import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import ACoreController from '@common/core/core.controller';
import CategoryService from './category.service';

@AppController('category', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Employee] })
export default class CategoryController extends ACoreController {
   constructor(protected readonly service: CategoryService) {
      super();
   }
}
