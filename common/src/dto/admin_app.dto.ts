import { BaseDto } from '@common/dto';
import { AuthCredential, Merchant } from '@common/schema';
import { User } from '@common/schema/user.schema';

export type UserReturn = { data: User };

export interface AdminAppServiceMethods {
  getAuthData(dto: BaseDto): Promise<{
    config: AppConfig;
    user: AuthUser;
    merchant: Merchant;
    isSubActive: boolean;
    basicAuth: { userName: string; password: string };
  }>;
}

export interface AdminAppSharedServiceMethods extends AdminAppServiceMethods {}
