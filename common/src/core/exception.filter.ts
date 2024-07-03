import { APP } from '@common/constant';
import { responseError } from '@common/utils/misc';
import { firstUpperCase } from '@common/utils/regex';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const logger = new Logger(firstUpperCase(this.config.get(APP)));
    logger.error(exception);
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      return responseError(request, response, exception);
    }
    return {
      code: exception.error === 'Forbidden resource' ? 403 : exception.status ?? 500,
      message: exception.message ?? 'Internal Server Error',
    };
  }
}
