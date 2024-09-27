import { IsBoolean, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Cash, ProductPurchased } from '@common/dto/entity.dto';
import { BaseDto } from '@common/dto/core.dto';

export class GetApplicableAllowanceDto extends BaseDto {
   @ValidateNested()
   @Type(() => Cash)
   basePrice: Cash;

   @IsOptional()
   @IsMongoId()
   priceId?: string;

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

export class AllowanceUsage {
   @IsMongoId()
   allowanceId: string;

   @IsBoolean()
   keep: boolean;
}

export class GetAllowanceUsageDto {
   @ValidateNested({ each: true })
   @Type(() => AllowanceUsage)
   usages: AllowanceUsage[];
}
