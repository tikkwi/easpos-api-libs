import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from '@common/dto/global/action.dto';

export class CreatePriceDto {
   @ValidateNested()
   @Type(() => CategoryDto)
   categoryDto: CategoryDto;

   @IsMongoId()
   productId: string;
}
