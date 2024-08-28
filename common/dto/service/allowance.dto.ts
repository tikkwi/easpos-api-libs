import { IntersectionType, OmitType } from '@nestjs/swagger';
import { CoreDto } from '@common/dto/global/core.dto';
import { Allowance, AllowanceBenefit } from '@common/schema/allowance.schema';
import { IsMongoId } from 'class-validator';

export class CreateAllowanceDto extends IntersectionType(
   OmitType(CoreDto(Allowance), ['campaign']),
   AllowanceBenefit,
) {
   @IsMongoId()
   campaignId: string;
}
