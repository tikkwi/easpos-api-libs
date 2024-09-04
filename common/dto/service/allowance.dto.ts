import { IsBoolean, IsMongoId, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPurchased } from '@common/dto/global/entity.dto';

export class GetApplicableAllowanceDto {
   @IsNumber()
   basePrice: number;

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
