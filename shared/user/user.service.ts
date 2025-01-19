import { compareSync } from 'bcryptjs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { omit, uniq } from 'lodash';
import { Request, Response } from 'express';
import { responseError } from '@common/utils/misc';
import { EUser, EUserApp } from '@common/utils/enum';
import { BaseUser } from './user.schema';
import BaseService from '@common/core/base/base.service';
import { AuthenticateLoginMfaDto, CreateUserDto, LoginDto } from './user.dto';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AddressService from '../address/address.service';
import CategoryService from '../category/category.service';
import process from 'node:process';
import { $dayjs } from '@common/utils/datetime';
import { encrypt } from '@common/utils/encrypt';

export abstract class AUserService<T extends BaseUser = BaseUser> extends BaseService<T> {
   protected abstract readonly appBroker: AppBrokerService;
   protected abstract readonly merchantService: MerchantServiceMethods;
   protected abstract readonly addressService: AddressService;
   protected abstract readonly categoryService: CategoryService;

   async logout(req: Request, res: Response) {
      req.session.destroy((err) => responseError(req, res, err));
      return { message: 'Success' };
   }

   async login(req: Request, { email, userName, password, app, merchantId }: LoginDto) {
      if (req.session.user) throw new BadRequestException('Already Logged In');
      const ctx = req.ctx;
      const repository = await this.getRepository(ctx.connection, ctx.session);
      const { data: user } = await repository.findOne({
         filter: { email, userName },
         errorOnNotFound: true,
      });
      const userType = this.constructor.name.replace('Service', '');
      if (!user || !compareSync(password, user.password))
         throw new BadRequestException(`Incorrect ${email ? 'email' : 'userName'} or password`);
      const appForbiddenMsg = `Not Allowed to use ${app}`;
      if (userType === EUser.Employee && !merchantId)
         throw new BadRequestException('Merchant Id is required');
      switch (userType) {
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
      const code = Math.random().toString().replace('0.', '').slice(0, 6);
      //TODO: send mail/sms for the otp
      await repository.findAndUpdate({
         id: user.id,
         update: { mfa: { code, expireAt: $dayjs().add(3, 'minutes') } },
      });
      return { message: 'OTP send..' };
   }

   async authenticateLoginMfa(
      req: Request,
      { userId, code, app, merchantId }: AuthenticateLoginMfaDto,
   ) {
      const repository = await this.getRepository(req.ctx.connection, req.ctx.session);
      const { data: user }: any = await repository.findOne({
         id: userId,
         errorOnNotFound: true,
         options: {
            populate: [
               { path: 'role', populate: ['permissions'] },
               { path: 'permissions' },
               { path: 'tier' },
            ],
         },
      });
      let errorMsg: string | undefined;
      const userType = this.constructor.name.replace('Service', '');
      if (!user.mfa || $dayjs().isAfter($dayjs(user.mfa.expireAt))) errorMsg = 'Expired';
      if (user.mfa.code !== code) errorMsg = 'Wrong MFA';
      if (userType === EUser.Employee && !merchantId) errorMsg = 'Merchant Id is required';
      if (errorMsg) throw new BadRequestException(errorMsg);
      const authUser: AuthUser = { ...(omit(user, ['mfa', 'password']) as any), app };
      if (userType === EUser.Employee)
         await this.appBroker.request<AuthMerchant>({
            action: (meta) =>
               this.merchantService.loginUser(
                  {
                     ctx: req.ctx,
                     merchantId: merchantId,
                     userId: user.id,
                     name: `${user.firstName} ${user.lastName}`,
                     app,
                  },
                  meta,
               ),
            app: process.env['APP'] as EApp,
            cache: true,
            key: 'merchant',
         });
      const permissions = [];
      if (user.permissions) permissions.splice(0, 0, ...user.permissions.permissions);
      if (user.role) permissions.splice(0, 0, ...user.role.permissions.permissions);
      if (user.tier?.benefits)
         user.tier.benefits.forEach(({ permissions: tP }) => tP && permissions.splice(0, 0, ...tP));
      authUser.permissions = uniq(permissions);
      req.session.user = encrypt(JSON.stringify(authUser));
      return { message: 'Success' };
   }

   protected async getCreateUserDto({ ctx, addressId, tagsDto, ...dto }: CreateUserDto) {
      const tags = [];
      if (tagsDto)
         for (const tg of tagsDto) {
            const { data: tag } = await this.categoryService.getCategory({ ctx, ...tg });
            tags.push(tag);
         }
      const { data: address } = await this.addressService.findById({ ctx, id: addressId });
      return { tags, address, ...dto };
   }
}
