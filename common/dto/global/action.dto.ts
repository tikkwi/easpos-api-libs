import { IsEnum, IsMongoId, Matches, ValidateIf } from 'class-validator';
import { regex } from '@common/utils/regex';
import { ECategory } from '@common/utils/enum';

export class CategoryDto {
   @ValidateIf((o) => !!!o.name)
   @IsMongoId()
   id?: string;

   @ValidateIf((o) => !!!o.id)
   @Matches(regex.enum)
   name?: string;

   @ValidateIf((o) => !!!o.id)
   @IsEnum(ECategory)
   type?: ECategory;
}
