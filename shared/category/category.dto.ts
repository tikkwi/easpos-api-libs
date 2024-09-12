import { CoreDto } from '@common/dto/core.dto';
import Category from './category.schema';

export class CreateCategoryDto extends CoreDto(Category) {}
