import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { getServiceToken } from '@common/utils/misc';
import { ADMIN, CUSTOMER, MERCHANT_USER, PARTNER } from '@common/constant';
import {
   AdminServiceMethods,
   CustomerServiceMethods,
   MerchantUserServiceMethods,
   PartnerServiceMethods,
   UserServiceGetUserDto,
   UserServiceMethods,
} from '@common/dto/user.dto';
import { EUser } from '@common/utils/enum';

@AppService()
export class UserService extends CoreService implements UserServiceMethods {
   constructor(
      protected readonly context: ContextService,
      @Inject(getServiceToken(ADMIN)) private readonly adminService: AdminServiceMethods,
      @Inject(getServiceToken(MERCHANT_USER))
      private readonly merchantUserService: MerchantUserServiceMethods,
      @Inject(getServiceToken(CUSTOMER)) private readonly customerService: CustomerServiceMethods,
      @Inject(getServiceToken(PARTNER)) private readonly partnerService: PartnerServiceMethods,
   ) {
      super();
   }

   async getUser({ type, ...dto }: UserServiceGetUserDto) {
      return await (type === EUser.Admin
         ? this.adminService.getUser(dto)
         : type === EUser.Merchant
           ? this.merchantUserService.getUser(dto)
           : type === EUser.Customer
             ? this.customerService.getUser(dto)
             : this.partnerService.getUser(dto));
   }
}
