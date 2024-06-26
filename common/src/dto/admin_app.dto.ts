import { IsMongoId, IsNotEmpty, IsUrl } from 'class-validator';
import { AuthUser } from './core.dto';
import { Merchant } from '@common/schema/merchant.schema';

export class GetAuthDataDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsMongoId()
  id?: string;
}

export interface AdminAppServiceMethods {
  getAuthData(dto: GetAuthDataDto): Promise<{
    config: AppConfig;
    user: AuthUser;
    merchant: Merchant;
    isSubActive: boolean;
    basicAuth: { userName: string; password: string };
  }>;
}

export interface AdminAppSharedServiceMethods extends AdminAppServiceMethods {}
