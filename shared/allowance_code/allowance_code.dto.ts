import { CoreDto } from '@common/dto/core.dto';
import { OmitType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import AllowanceCode from './allowance_code.schema';

class AllowanceCodeDto extends AllowanceCode {
   allowance: any;
}

export class CreateAllowanceCodeDto extends OmitType(CoreDto(AllowanceCodeDto), ['allowance']) {
   @IsMongoId()
   allowanceId: string;
}
