import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { CategoryDto } from '../global/action.dto';
import { CoreDto, FindByIdDto } from '../global/core.dto';
import { LoggedInMerchantUser, Merchant } from '@common/schema/merchant.schema';
import { IsAppNumberString } from '@common/validator';

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

type MerchantWithAuthReturn = {
   data: {
      merchant: Merchant;
      isSubActive: boolean;
   };
};

export interface MerchantServiceMethods {
   merchantWithAuth(dto: FindByIdDto, meta: Metadata): Promise<MerchantWithAuthReturn>;

   tmpTst(meta: Metadata): { data: string };
}
