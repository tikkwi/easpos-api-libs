import { IsBoolean, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Amount, ProductPurchased } from '@common/dto/entity.dto';
import { BaseDto } from '@common/dto/core.dto';

export type PurchasedAllowanceType = {
   point: number;
   discount: number;
   cash: number;
   product: Array<{ id: string; amount: number; unitId?: string }>;
};

export class GetApplicableAllowanceDto extends BaseDto {
   @ValidateNested()
   @Type(() => Amount)
   basePrice: Amount;

   @IsOptional()
   @IsString()
   coupon?: string;

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
