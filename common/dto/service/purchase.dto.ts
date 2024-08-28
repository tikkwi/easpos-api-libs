import { OmitType } from '@nestjs/swagger';
import { CoreDto } from '@common/dto/global/core.dto';
import { Purchase } from '@common/schema/purchase.schema';

export class CreatePurchaseDto extends OmitType(CoreDto(Purchase), ['status', 'voucherId']) {}
