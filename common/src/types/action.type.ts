import { regex, ECategory } from '@app/helper';
import { IsEnum, IsMongoId, IsNotEmpty, Matches, ValidateIf } from 'class-validator';

export class CategoryDto {
  @IsMongoId()
  id: string;

  @ValidateIf((o) => !!!o.id)
  @IsNotEmpty()
  @Matches(regex.enum)
  name?: string;

  @IsEnum(ECategory)
  type?: ECategory;
}
