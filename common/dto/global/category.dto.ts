import { CoreDto } from '@common/dto/global/core.dto';
import { Category } from '@common/schema/category.schema';

export class CreateCategoryDto extends CoreDto(Category) {}
