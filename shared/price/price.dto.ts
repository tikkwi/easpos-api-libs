import { IsMongoId } from 'class-validator';
import { CategoryDto } from '@common/dto/action.dto';
import { IntersectionType, OmitType } from '@nestjs/swagger';
import { CoreDto } from '@common/dto/core.dto';
import Price from './price.schema';

export class CreatePriceDto extends IntersectionType(
   OmitType(CoreDto(Price), ['product']),
   CategoryDto,
) {
   @IsMongoId()
   productId: string;
}
