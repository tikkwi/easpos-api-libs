import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { CategoryDto } from '../global/action.dto';
import { CoreDto, FindByIdDto } from '../global/core.dto';
import { LoggedInMerchantUser, Merchant } from '@common/schema/shared/merchant.schema';
import { IsAppNumberString } from '@common/validator';
import { MFA } from '@common/dto/global/entity.dto';

export class CreateMerchantDto extends OmitType(CoreDto(Merchant), [
   'activePurchases',
   'status',
   'type',
]) {
   @IsNotEmpty()
   @ValidateNested()
   @Type(() => CategoryDto)
   category: CategoryDto;
}

export class MerchantUserLoginDto extends LoggedInMerchantUser {
   @IsMongoId()
   id: string;
}

export class MerchantVerifyDto extends OmitType(FindByIdDto, ['errorOnNotFound']) {
   @IsAppNumberString()
   code: string;
}

type MerchantReturn = { data: Merchant };
type MerchantWithAuthReturn = {
   data: {
      merchant: Merchant;
      isSubActive: boolean;
   };
};

export interface MerchantServiceMethods {
   getMerchant(dto: FindByIdDto, meta?: Metadata): Promise<MerchantReturn>;

   merchantWithAuth(dto: FindByIdDto, meta?: Metadata): Promise<MerchantWithAuthReturn>;

   createMerchant(dto: CreateMerchantDto): Promise<MerchantReturn>;

   loginUser(dto: MerchantUserLoginDto, meta?: Metadata): Promise<MerchantWithAuthReturn>;

   tmpTst(meta: Metadata): { data: string };

   requestVerification(dto: FindByIdDto, meta: Metadata): Promise<{ data: MFA }>;

   verify(dto: MerchantVerifyDto, meta: Metadata): Promise<void>;
}
