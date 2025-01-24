import { IsString } from 'class-validator';
import { FindDto } from '@common/dto/core.dto';
import { OmitType } from '@nestjs/swagger';

export class GetPromoCodeDto extends OmitType(FindDto, ['errorOnNotFound']) {
   @IsString()
   code: string;
}
