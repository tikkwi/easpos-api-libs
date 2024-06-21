import { C_REQ } from '@common/constant';
import { CoreController } from '@common/core/core.controller';
import { Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AppController } from '@common/decorator/app_controller.decorator';
import { CreateUserDto } from '@common/dto/user.dto';

@AppController('user')
export class UserController extends CoreController<UserService> {
  @Post('create')
  async createUser(@Body() dto: Omit<CreateUserDto, 'request'>) {
    return this.service.createUser({ ...dto, request: this.context.get(C_REQ) });
  }
}
