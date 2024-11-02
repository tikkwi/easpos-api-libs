import { BaseDto } from '@common/dto/core.dto';
import { IsEmail, IsNumber, ValidateNested } from 'class-validator';
import { Subscription } from '@common/dto/entity.dto';

export class SubMonitorDto extends BaseDto {
   @IsEmail()
   mail: string;

   @ValidateNested()
   subscription: Subscription;

   @IsNumber()
   preSubEndMail: number;
}
