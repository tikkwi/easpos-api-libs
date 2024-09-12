import { Get, Param } from '@nestjs/common';
import CoreService from './core.service';

export default abstract class CoreController {
   protected abstract service: CoreService<any>;

   @Get(':id')
   get(@Param('id') id: string) {
      return this.service.findById({ id });
   }
}
