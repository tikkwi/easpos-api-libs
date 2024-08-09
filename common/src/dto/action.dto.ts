import { ECategory } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { IsEnum, IsMongoId, IsOptional, Matches, ValidateIf } from 'class-validator';

export class CategoryDto {
   @IsOptional()
   @IsMongoId()
   id?: string;

   @ValidateIf((o) => !!!o.id)
   @Matches(regex.enum)
   name?: string;

   @IsOptional()
   @IsEnum(ECategory)
   type?: ECategory;
}
