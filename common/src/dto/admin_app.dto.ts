import { IsMongoId, IsNotEmpty, IsUrl } from 'class-validator';
import { AuthUser } from './core.dto';
import { Merchant } from '@common/schema/merchant.schema';
import { Metadata } from '@grpc/grpc-js';

export class GetAuthDataDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsMongoId()
  id?: string;
}

type GetAuthDataReturnType = {
  config: AppConfig;
  user: AuthUser;
  merchant: Merchant;
  isSubActive: boolean;
  basicAuth: { userName: string; password: string };
};

export interface AdminAppServiceMethods {
  getAuthData(dto: GetAuthDataDto): Promise<GetAuthDataReturnType>;
}

export interface AdminAppSharedServiceMethods {
  getAuthData(dto: GetAuthDataDto, meta?: Metadata): Promise<GetAuthDataReturnType>;
}
