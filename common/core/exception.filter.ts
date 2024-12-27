import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { responseError } from '@common/utils/misc';
import AppRedisService from './app_redis/app_redis.service';
import { ModuleRef } from '@nestjs/core';
import RequestContextService from './request_context/request_context_service';

@Catch()
export default class AppExceptionFilter implements ExceptionFilter {
   constructor(
      private readonly config: ConfigService,
      private readonly db: AppRedisService,
      private readonly moduleRef: ModuleRef,
   ) {}

   async catch(err: any, host: ArgumentsHost) {
      // const logger = new Logger(firstUpperCase(this.config.get(APP)));
      // logger.error(err);
      const contextService = await this.moduleRef.resolve(RequestContextService);
      const session = contextService.get('session');
      session.abortTransaction();
      session.endSession();
      if (host.getType() === 'http') {
         const ctx = host.switchToHttp();
         const response = ctx.getResponse<Response>();
         const request = ctx.getRequest<Request>();
         responseError(request, response, err);
      }
      return {
         code: err.error === 'Forbidden resource' ? 403 : err.status ?? 500,
         message: err.message ?? 'Internal Server Error',
      };
   }
}
