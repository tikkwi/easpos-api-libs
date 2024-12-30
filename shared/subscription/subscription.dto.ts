import { IsEmail, IsNumber, ValidateNested } from 'class-validator';
import { Subscription } from '@common/dto/entity.dto';

export class SubMonitorDto {
   @IsEmail()
   mail: string;

   @ValidateNested()
   subscription: Subscription;

   @IsNumber()
   preSubEndMail: number;
}
