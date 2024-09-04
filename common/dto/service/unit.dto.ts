import { IsMongoId, IsNumber } from 'class-validator';

export class GetBaseAmountDto {
   @IsNumber()
   amount: number;

   @IsMongoId()
   unitId: string;
}
