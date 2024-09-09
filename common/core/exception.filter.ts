import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { APP } from '@common/constant';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { responseError } from '@common/utils/misc';
import { firstUpperCase } from '@common/utils/regex';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
   constructor(
      private readonly config: ConfigService,
      private readonly db: AppRedisService,
   ) {}

   async catch(err: any, host: ArgumentsHost) {
      const logger = new Logger(firstUpperCase(this.config.get(APP)));
      logger.error(err);
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
