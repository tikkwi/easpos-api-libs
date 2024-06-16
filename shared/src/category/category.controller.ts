import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AppController } from '@app/decorator';

@AppController('shared-api/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}
}
