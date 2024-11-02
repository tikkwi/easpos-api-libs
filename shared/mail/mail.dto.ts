import { Type } from 'class-transformer';
import {
   IsDateString,
   IsEmail,
   IsEnum,
   IsNotEmpty,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { EMail } from '@common/utils/enum';

class SubExpireDto {
   @IsNotEmpty()
   @IsDateString()
   expireAt: string;
}

export class SendMailDto {
   @IsEmail()
   @IsNotEmpty()
   mail: string;

   @IsNotEmpty()
   @IsEnum(EMail)
   type: EMail;

   @ValidateNested()
   @ValidateIf((o) => o === EMail.MerchantSubscriptionExpire)
   @Type(() => SubExpireDto)
   expirePayload?: SubExpireDto;

   @ValidateNested()
   @ValidateIf((o) => o === EMail.MerchantPreSubscriptionExpire)
   @Type(() => SubExpireDto)
   preExpirePayload?: SubExpireDto;
}

export interface MailServiceMethods {
   sendMail(dto: SendMailDto): Promise<void>;
}
