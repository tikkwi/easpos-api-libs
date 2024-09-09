import { IsBoolean, IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Cash, ProductPurchased } from '@common/dto/global/entity.dto';

export class GetApplicableAllowanceDto {
   @ValidateNested()
   @Type(() => Cash)
   basePrice: Cash;

   @IsOptional()
   @IsMongoId()
   priceId?: string;

   @IsMongoId()
   currencyId: string;

   @IsMongoId()
   paymentMethodId: string;

   @IsBoolean()
   perProduct: boolean;

   @IsOptional()
   @IsMongoId()
   addressId?: string;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => ProductPurchased)
   products?: ProductPurchased[];
}
