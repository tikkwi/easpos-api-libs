import ACoreController from '@common/core/core.controller';
import { Body, Post } from '@nestjs/common';
import { LoginDto } from './user.dto';
import { AUserService } from './user.service';

export default abstract class AUserController<T extends AUserService> extends ACoreController {
   protected abstract readonly service: T;

   @Post('login')
   async login(@Body() dto: LoginDto) {
      return this.service.login(dto);
   }

   @Post('logout')
   async logout() {
      return this.service.logout();
   }
}
