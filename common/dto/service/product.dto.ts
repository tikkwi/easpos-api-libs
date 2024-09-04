import { IsString } from 'class-validator';
import { FindDto } from '@common/dto/global/core.dto';

export class GetProductDto extends FindDto {
   @IsString()
   code: string;
}
