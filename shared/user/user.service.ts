import { compareSync } from 'bcryptjs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { concat, omit, uniq } from 'lodash';
import { request, Request, Response } from 'express';
import { responseError } from '@common/utils/misc';
import { EUser, EUserApp } from '@common/utils/enum';
import { encrypt } from '@common/utils/encrypt';
import { BaseUser } from './user.schema';
import BaseService from '@common/core/base/base.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import { CreateUserDto, LoginDto } from './user.dto';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AddressService from '../address/address.service';
import CategoryService from '../category/category.service';

export abstract class AUserService<T extends BaseUser = BaseUser> extends BaseService<T> {
   protected abstract readonly db: AppRedisService;
   protected abstract readonly appBroker: AppBrokerService;
   protected abstract readonly merchantService: MerchantServiceMethods;
   protected abstract readonly addressService: AddressService;
   protected abstract readonly categoryService: CategoryService;

   async logout(req: Request, res: Response) {
      req.session.destroy((err) => responseError(req, res, err));
   }

   async login(req: Request, { email, userName, password, app, merchantId }: LoginDto) {
      if (req.session.user) throw new BadRequestException('Already Logged In');
      const repository = await this.getRepository();
      const { data: user }: any = await repository.findOne({
         filter: {
            email,
            userName,
         },
         errorOnNotFound: true,
         options: { populate: ['role', 'tier'] },
      });
      if (!user || !compareSync(password, user.password))
         throw new BadRequestException(`Incorrect ${email ? 'email' : 'userName'} or password`);
      const authUser: AuthUser = { ...(omit(user, ['mfa', 'password']) as any), app };
      const appForbiddenMsg = `Not Allowed to use ${app}`;
      if (user.type === EUser.Employee && !merchantId)
         throw new BadRequestException('Merchant Id is required');
      switch (user.type) {
         case EUser.Admin:
            if (app !== EUserApp.SuperAdmin) throw new ForbiddenException(appForbiddenMsg);
            break;
         case EUser.Employee:
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

      if (user.type === EUser.Employee)
         await this.appBroker.request<AuthMerchant>({
            action: (meta) =>
               this.merchantService.loginUser(
                  {
                     id: merchantId,
                     userId: user.id,
                     name: `${user.firstName} ${user.lastName}`,
                     app,
                  },
                  meta,
               ),
            cache: true,
            key: 'merchant',
         });
      if (user.role) {
         authUser.isOwner = user.role.isOwner;
         authUser.permissions = user.role.permissions;
      }
      if (user.tier)
         authUser.permissions = uniq(
            concat(...user.tier.benefits.map(({ permissions }) => permissions)),
         );
      request.session.user = await encrypt(JSON.stringify(authUser));
   }

   protected async getCreateUserDto({ addressId, tagsDto, ...dto }: CreateUserDto) {
      const tags = [];
      if (tagsDto)
         for (const tg of tagsDto) {
            const { data: tag } = await this.categoryService.getCategory(tg);
            tags.push(tag);
         }
      const { data: address } = await this.addressService.findById({ id: addressId });
      return { tags, address, ...dto };
   }
}
