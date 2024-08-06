import { AppController } from '@common/decorator/app_controller.decorator';
import { Body, Post } from '@nestjs/common';
import { TmpService } from './tmp.service';

@AppController('tmp')
export class TmpController {
   constructor(private readonly service: TmpService) {}

   @Post('create')
   async create(@Body() dto) {
      return await this.service.create(dto);
   }
}
