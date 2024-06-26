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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    logger.error(exception);
    responseError(request, response, exception);
  }
}
