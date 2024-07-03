import { Merchant } from '@common/schema/merchant.schema';
import { Metadata } from '@grpc/grpc-js';
import { IsMongoId, IsNotEmpty, IsUrl } from 'class-validator';

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

export interface AdminAppSharedServiceMethods {
  getAuthData(dto: GetAuthDataDto, meta?: Metadata): Promise<GetAuthDataReturnType>;
}
