import { compareSync } from 'bcryptjs';
import {
   BadRequestException,
   ForbiddenException,
   InternalServerErrorException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { request } from 'express';
import { CoreService } from '@common/core/service/core.service';
import { Repository } from '@common/core/repository';
import { User } from '@common/schema/user.schema';
import { ContextService } from '@common/core/context/context.service';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { responseError } from '@common/utils/misc';
import { LoginDto } from '@common/dto/global/user.dto';
import { EUser, EUserApp } from '@common/utils/enum';
import { encrypt } from '@common/utils/encrypt';

export abstract class UserService extends CoreService {
   protected abstract repository: Repository<User>;
   protected readonly context: ContextService;
   protected readonly db: AppRedisService;

   async logout() {
      const request = this.context.get('request');
      const response = this.context.get('response');
      await this.db.logout();
      request.session.destroy((err) => responseError(request, response, err));
   }

   protected async login(
      { email, userName, password, app }: LoginDto,
      loginMerchant?: (id: string, app: EUserApp) => Promise<AppMerchant>,
   ) {
      const { data: user }: any = await this.repository.findOne({
         filter: {
            email,
            userName,
         },
         options: { populate: ['role'] },
      });
      if (!user || !compareSync(password, user.password))
         throw new BadRequestException(`Incorrect ${email ? 'email' : 'userName'} or password`);
      const authUser: AuthUser = { ...(omit(user, ['mfa', 'password']) as any), app };
      const appForbiddenMsg = `Not Allowed to use ${app}`;
      switch (user.type) {
         case EUser.Admin:
            if (app !== EUserApp.SuperAdmin) throw new ForbiddenException(appForbiddenMsg);
            break;
         case EUser.Merchant:
            if (![EUserApp.Seller, EUserApp.Admin].includes(app))
               throw new ForbiddenException(appForbiddenMsg);
            break;
         case EUser.Partner:
            if (app !== EUserApp.Partner) throw new ForbiddenException(appForbiddenMsg);
            break;
         case EUser.Customer:
            if (app !== EUserApp.Customer) throw new ForbiddenException(appForbiddenMsg);
            break;
      }
      if (user.merchant && !loginMerchant) throw new InternalServerErrorException();
      const merchant = loginMerchant ? await loginMerchant(user.merchant, app) : undefined;
      if (user.role) {
         authUser.isOwner = user.role.isOwner;
         authUser.permissions = user.role.role?.permissions?.reduce((a, c) => {
            a[c] = 1;
            return a;
         }, {});
      }
      request.session.user = await encrypt(JSON.stringify(authUser));
      if (merchant) await this.db.set('merchant', merchant);
   }
}
