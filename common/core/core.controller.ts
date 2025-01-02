import { Get, Param } from '@nestjs/common';
import BaseService from './base/base.service';

export default abstract class ACoreController {
   protected abstract service: BaseService<any>;

   @Get(':id')
   get(@Param('id') id: string) {
      return this.service.findById({ id });
   }
}
