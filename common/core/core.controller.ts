import { Get, Param } from '@nestjs/common';
import { CoreService } from '@common/core/service/core.service';

export abstract class CoreController {
   protected abstract service: CoreService<any>;

   @Get(':id')
   get(@Param('id') id: string) {
      return this.service.findById({ id });
   }
}
