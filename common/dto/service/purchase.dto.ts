import { OmitType, PickType } from '@nestjs/swagger';
import { CoreDto } from '@common/dto/global/core.dto';
import { Purchase } from '@common/schema/purchase.schema';
import { GetApplicablePriceDto } from '@common/dto/service/price_level.dto';
import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseDto extends OmitType(CoreDto(Purchase), ['status', 'voucherId']) {}

class PurchasedProduct extends PickType(GetApplicablePriceDto, ['id', 'amount']) {
   @IsMongoId()
   productId: string;
}

export class GetPriceDto extends PickType(GetApplicablePriceDto, [
   'currencyId',
   'paymentMethodId',
]) {
   @ValidateNested()
   @Type(() => PurchasedProduct)
   products: PurchasedProduct[];

   @IsMongoId()
   allowanceId: string;
}
