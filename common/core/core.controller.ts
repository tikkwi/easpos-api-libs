import { Get, Param } from '@nestjs/common';
import ACoreService from './core.service';

export default abstract class ACoreController {
   protected abstract service: ACoreService<any>;

   @Get(':id')
   get(@Param('id') id: string) {
      return this.service.findById({ id });
   }
}
