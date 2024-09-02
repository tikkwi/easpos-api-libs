import { IsMongoId } from 'class-validator';

export class GetApplicablePriceLevelDto {
   @IsMongoId()
   currencyId: string;

   @IsMongoId()
   paymentMethodId: string;

   @IsMongoId()
   priceId: string;
}
