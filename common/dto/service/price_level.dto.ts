import { IsMongoId, IsNumber, ValidateIf } from 'class-validator';

export class GetApplicablePriceDto {
   @ValidateIf((o) => !o.price)
   @IsMongoId()
   id?: string;

   @ValidateIf((o) => !o.id)
   @IsNumber()
   amount?: number;

   @IsMongoId()
   currencyId: string;

   @IsMongoId()
   paymentMethodId: string;
}
