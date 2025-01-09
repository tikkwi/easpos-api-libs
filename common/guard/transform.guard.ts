import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ModuleRef } from '@nestjs/core';
import process from 'node:process';
import { decrypt } from '../utils/encrypt';
import AppContext from '../core/app_context.service';

@Injectable()
export default class TransformGuard implements CanActivate {
   constructor(private readonly moduleRef: ModuleRef) {}

   async canActivate(context: ExecutionContext) {
      const ctx = {
         logTrail: [],
         requestedApp: process.env['APP'] as EApp,
         contextType: context.getType(),
      };
      if (context.getType() === 'http') {
         const request: Request = context.switchToHttp().getRequest();
         let user: AuthUser;
         if (request.session.user) user = await decrypt<AuthUser>(request.session.user);
         const connection = AppContext.getConnection();
         request.ctx = {
            ...ctx,
            user,
            ip: request.ip,
            userAgent: request.headers['user-agent'],
            connection,
            session: await connection.startSession(),
         };
      }
      return true;
   }
}
