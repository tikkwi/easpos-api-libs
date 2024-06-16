import { AppController } from '@app/decorator';
import { Body, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './user.dto';

@AppController('user-api/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('create')
  async createUser(
    @Req() request: Request,
    @Res() _: Response,
    @Body() dto: Omit<CreateUserDto, 'request'>,
  ) {
    return this.service.createUser({ ...dto, request });
  }
}
