import { BadRequestException } from '@nestjs/common';
import { omit, uniq } from 'lodash';
import { Request, Response } from 'express';
import { connectMerchantDb, responseError } from '@common/utils/misc';
import { EUser, EUserApp } from '@common/utils/enum';
import User, { BaseUser } from './user.schema';
import BaseService from '@common/core/base/base.service';
import { AuthenticateLoginMfaDto, CreateUserDto, LoginDto } from './user.dto';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AddressService from '../address/address.service';
import CategoryService from '../category/category.service';
import { $dayjs } from '@common/utils/datetime';
import { encrypt } from '@common/utils/encrypt';
import { compareSync } from 'bcryptjs';

export abstract class AUserService<T extends BaseUser = BaseUser> extends BaseService<T> {
   protected abstract readonly appBroker: AppBrokerService;
   protected abstract readonly merchantService: MerchantServiceMethods;
   protected abstract readonly addressService: AddressService;
   protected abstract readonly categoryService: CategoryService;

   async logout(req: Request, res: Response) {
      req.session.destroy((err) => responseError(req, res, err));
      return { message: 'Success' };
   }

   async login(req: Request, { mail, userName, password, app, merchantId }: LoginDto) {
      if (req.session.user) throw new BadRequestException('Already Logged In');
      const ctx = req.ctx;
      await connectMerchantDb(ctx, merchantId);
      const repository = await this.getRepository(ctx.connection, ctx.session);
      const { data: user } = await repository.findOne({
         filter: { mail: mail, userName },
         errorOnNotFound: true,
      });
      const userType = this.constructor.name.replace('Service', '');
      if (!user || !compareSync(password, user.password))
         throw new BadRequestException(`Incorrect ${mail ? 'email' : 'userName'} or password`);
      let isAppForbidden = false;
      if (userType === EUser.Employee && !merchantId)
         throw new BadRequestException('Merchant Id is required');
      switch (userType) {
         case EUser.Admin:
            if (app !== EUserApp.SuperAdmin) isAppForbidden = true;
            break;
         case EUser.Employee:
            if (![EUserApp.Seller, EUserApp.Admin].includes(app)) isAppForbidden = true;
            break;
         case EUser.Partner:
            if (app !== EUserApp.Partner) isAppForbidden = true;
            break;
         case EUser.Customer:
            if (app !== EUserApp.Customer) isAppForbidden = true;
            break;
      }
      if (isAppForbidden) throw new BadRequestException(`Not Allowed to use ${app}`);
      const code = Math.random().toString().replace('0.', '').slice(0, 6);
      //TODO: send mail/sms for the otp
      await repository.findAndUpdate({
         id: user._id,
         update: { mfa: { code, expireAt: $dayjs().add(3, 'minutes').toDate() } },
      });

      return { message: 'OTP send..' };
   }

   //NOTE: can't public as child need to initialize ctx connection and populated schemas first
   protected async $authenticateLoginMfa(
      req: Request,
      usr: User,
      { userId, code, app, merchantId }: AuthenticateLoginMfaDto,
   ) {
      const user = usr as any;
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
                     userId,
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
      if (user.permissions?.length) permissions.splice(0, 0, ...user.permissions.permissions);
      if (user.role?.permissions?.length)
         permissions.splice(0, 0, ...user.role.permissions.permissions);
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
