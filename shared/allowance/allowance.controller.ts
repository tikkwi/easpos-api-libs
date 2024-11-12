import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import ACoreController from '@common/core/core.controller';
import AllowanceService from './allowance.service';
import { Get, Param } from '@nestjs/common';
import { GetApplicableAllowanceDto } from './allowance.dto';

@AppController('allowance', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Merchant] })
export default class AllowanceController extends ACoreController {
   constructor(protected readonly service: AllowanceService) {
      super();
   }

   @Get('applicable')
   async getApplicable(@Param() dto: GetApplicableAllowanceDto) {
      return this.service.getApplicableAllowances(dto);
   }
}
