import { CoreDto } from '@common/dto/global/core.dto';
import { AllowanceCode } from '@common/schema/allowance_code.schema';
import { OmitType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateAllowanceCodeDto extends OmitType(CoreDto(AllowanceCode), ['allowance']) {
   @IsMongoId()
   allowanceId: string;
}
