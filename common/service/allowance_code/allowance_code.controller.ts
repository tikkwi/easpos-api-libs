import { CoreController } from '@common/core/core.controller';
import { Body, Post } from '@nestjs/common';
import { CreateAllowanceCodeDto } from '@common/dto/service/allowance_code.dto';

export abstract class AllowanceCodeController extends CoreController {
   @Post('create')
   async createAllowanceCode(@Body() dto: CreateAllowanceCodeDto) {
      return this.service.create(dto);
   }
}
