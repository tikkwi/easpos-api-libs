import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContextService } from '@common/core/context/context.service';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { responseError } from '@common/utils/misc';
import { Repository } from '@common/core/repository';
import { LoginDto } from '@common/dto/user.dto';
import { compareSync } from 'bcryptjs';
import { Merchant } from '@common/schema/merchant.schema';
import { omit } from 'lodash';
import { request } from 'express';
import { decrypt } from '@common/utils/encrypt';
import { APP_MERCHANT } from '@common/constant';

@Injectable()
export class MiscService {
   constructor(
      private readonly context: ContextService,
      private readonly db: AppRedisService,
   ) {}

   async login(
      repository: Repository<User>,
      { email, userName, password }: LoginDto,
      getMerchant?: () => Promise<Merchant>,
   ) {
      const { data: user }: any = await repository.findOne({
         filter: {
            em,
            userName,
         },
         options: { populate: ['role'] },
      });
      if (!user || !compareSync(password, user.password))
         throw new BadRequestException(`Incorrect ${email ? 'email' : 'userName'} or password`);
      const authUser: AuthUser = omit(user, ['mfa', 'password']);
      if (user.merchant && !getMerchant) throw new InternalServerErrorException();
      const merchant = getMerchant ? await getMerchant() : undefined;
      if (user.role) {
         authUser.isOwner = user.role.isOwner;
         authUser.permissions = user.role.role?.permissions?.reduce((a, c) => {
            a[c] = 1;
            return a;
         }, {});
      }
      request.session.user = decrypt(authUser);
      if (merchant) await this.db.set(APP_MERCHANT, merchant);
   }

   async logout() {
      const request = this.context.get('request');
      const response = this.context.get('response');
      await this.db.logout();
      request.session.destroy((err) => responseError(request, response, err));
   }
}
