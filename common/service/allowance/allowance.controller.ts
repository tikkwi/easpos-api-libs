import { Body, Post } from '@nestjs/common';
import { CreateAllowanceDto } from '@common/dto/service/allowance.dto';
import { CoreController } from '@common/core/core.controller';

export abstract class AllowanceController extends CoreController {
   @Post('create')
   createAllowance(@Body() dto: CreateAllowanceDto) {
      return this.service.create(dto);
   }
}
