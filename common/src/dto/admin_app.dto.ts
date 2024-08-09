import { Merchant } from '@common/schema/merchant.schema';
import { IsMongoId, IsUrl } from 'class-validator';

export class GetAuthDataDto {
   @IsUrl()
   url: string;

   @IsMongoId()
   id: string;
}

type GetAuthDataReturnType = {
   isSubActive: boolean;
   merchant: Merchant | undefined;
   basicAuth: { userName: string; password: string };
};

export interface AdminAppServiceMethods {
   getAuthData(dto: GetAuthDataDto): Promise<GetAuthDataReturnType>;
}
