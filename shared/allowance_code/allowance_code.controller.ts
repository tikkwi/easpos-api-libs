import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { Body, Post } from '@nestjs/common';
import { CreateAllowanceCodeDto } from './allowance_code.dto';
import CoreController from '@common/core/core.controller';
import AllowanceCodeService from './allowance_code.service';

@AppController('allowance_code', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Merchant] })
export default class AllowanceCodeController extends CoreController {
   constructor(protected readonly service: AllowanceCodeService) {
      super();
   }

   @Post('create')
   create(@Body() dto: CreateAllowanceCodeDto) {
      return this.service.createAllowanceCode(dto);
   }
}
