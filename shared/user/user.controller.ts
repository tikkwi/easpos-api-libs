import ACoreController from '@common/core/core.controller';
import { Body, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './user.dto';
import { AUserService } from './user.service';
import { Request, Response } from 'express';

export default abstract class AUserController<T extends AUserService> extends ACoreController {
   protected abstract readonly service: T;

   @Post('login')
   async login(@Req() req: Request, @Body() dto: LoginDto) {
      return this.service.login(req, dto);
   }

   @Post('logout')
   async logout(@Req() req: Request, @Res() res: Response) {
      return this.service.logout(req, res);
   }
}
