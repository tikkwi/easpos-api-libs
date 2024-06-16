import { GrpcHandler } from '@app/decorator';
import { CreateCategoryDto } from './category.dto';
import { CategoryService } from './category.service';

@GrpcHandler()
export class CategoryGrpcController {
  constructor(private readonly service: CategoryService) {}

  async createCategory(dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }
}
