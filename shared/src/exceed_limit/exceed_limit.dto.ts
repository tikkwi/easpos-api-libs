import { BaseDto, FindDto } from '@app/dto';
import { IsMongoId } from 'class-validator';

export class GetLimitDto extends FindDto {
  id?: string;
}

export class UnlimitRequestDto extends BaseDto {
  @IsMongoId()
  id?: string;
}
