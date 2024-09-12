import { OmitType } from '@nestjs/swagger';
import { CoreDto } from '@common/dto/core.dto';
import Purchase from './purchase.schema';

export class CreatePurchaseDto extends OmitType(CoreDto(Purchase), ['status', 'voucherId']) {}

// class PurchasedProduct extends PickType(GetApplicablePriceDto, ['id', 'amount']) {
//    @IsMongoId()
//    productId: string;
// }
//
// export class GetPriceDto extends PickType(GetApplicablePriceDto, [
//    'currencyId',
//    'paymentMethodId',
// ]) {
//    @ValidateNested()
//    @Type(() => PurchasedProduct)
//    products: PurchasedProduct[];
//
//    @IsMongoId()
//    allowanceId: string;
// }
