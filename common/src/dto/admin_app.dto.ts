import { User } from '@common/schema/user.schema';
import { BaseDto } from './core.dto';

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
