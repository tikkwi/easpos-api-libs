import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from './action.dto';
import { CoreDto, FindByIdDto } from './core.dto';
import Merchant, { LoggedInMerchantUser } from '@common/schema/merchant.schema';
import { IsAppNumberString } from '@common/validator';

export class CreateMerchantDto extends OmitType(CoreDto(Merchant), [
   'offlinePurchase',
   'subscriptionPurchase',
   'status',
   'type',
]) {
   @IsNotEmpty()
   @ValidateNested()
   @Type(() => CreateCategoryDto)
   category: CreateCategoryDto;
}

export class MerchantUserLoginDto extends LoggedInMerchantUser {
   @IsMongoId()
   id: string;
}

export class MerchantVerifyDto extends OmitType(FindByIdDto, ['errorOnNotFound']) {
   @IsAppNumberString()
   code: string;
}

export interface MerchantServiceMethods {
   loginUser(dto: MerchantUserLoginDto, meta: Metadata): Promise<AppMerchant>;

   tmpTst(meta: Metadata): { data: string };
}
