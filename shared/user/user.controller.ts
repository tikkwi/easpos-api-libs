import CoreController from '@common/core/core.controller';
import { Body, Post } from '@nestjs/common';
import { LoginDto } from './user.dto';
import { UserService } from './user.service';

export default abstract class UserController<T extends UserService> extends CoreController {
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
