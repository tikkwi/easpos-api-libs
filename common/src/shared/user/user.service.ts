import { CoreService } from '@common/core/service/core.service';
import { LoginDto } from '@common/shared/user/user.dto';
import { Repository } from '@common/core/repository';
import { User } from '@common/schema/user.schema';
import { compareSync } from 'bcryptjs';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { omit } from 'lodash';
import { request } from 'express';
import { encrypt } from '@common/utils/encrypt';
import { APP_MERCHANT } from '@common/constant';
import { responseError } from '@common/utils/misc';
import { ContextService } from '@common/core/context/context.service';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';

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
      { email, userName, password }: LoginDto,
      getMerchant?: (id: string) => Promise<AppMerchant>,
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
      const authUser = omit(user, ['mfa', 'password']);
      if (user.merchant && !getMerchant) throw new InternalServerErrorException();
      const merchant = getMerchant ? await getMerchant(user.merchant) : undefined;
      if (user.role) {
         authUser.isOwner = user.role.isOwner;
         authUser.permissions = user.role.role?.permissions?.reduce((a, c) => {
            a[c] = 1;
            return a;
         }, {});
      }
      request.session.user = await encrypt(JSON.stringify(authUser));
      if (merchant) await this.db.set(APP_MERCHANT, merchant);
   }
}
