import { EMail } from '@app/helper';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class SubExpireDto {
  @IsNotEmpty()
  @IsDateString()
  expireDate: Date;
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

export interface MailControllerMethods {
  sendMail(dto: SendMailDto, meta: Meta): Promise<void>;
}

export interface MailServiceMethods extends MailControllerMethods {}
