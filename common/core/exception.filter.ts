import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { APP } from '@common/constant';
import { responseError } from '@common/utils/misc';
import { firstUpperCase } from '@common/utils/regex';
import AppRedisService from './app_redis/app_redis.service';
import ContextService from './context.service';

@Catch()
export default class AppExceptionFilter implements ExceptionFilter {
   constructor(
      private readonly config: ConfigService,
      private readonly db: AppRedisService,
   ) {}

   async catch(err: any, host: ArgumentsHost) {
      const logger = new Logger(firstUpperCase(this.config.get(APP)));
      logger.error(err);
      const session = ContextService.get('session');
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
