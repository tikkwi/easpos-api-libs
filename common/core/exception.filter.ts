import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { responseError } from '@common/utils/misc';
import { ServerUnaryCall } from '@grpc/grpc-js';

@Catch()
export default class AppExceptionFilter implements ExceptionFilter {
   async catch(err: any, host: ArgumentsHost) {
      // const logger = new Logger(firstUpperCase(this.config.get(APP)));
      // logger.error(err);

      let ctx: RequestContext;
      if (host.getType() === 'http') {
         const context = host.switchToHttp();
         const response = context.getResponse<Response>();
         const request = context.getRequest<Request>();
         ctx = request.ctx;
         responseError(request, response, err);
      } else {
         const call: ServerUnaryCall<any, any> = (host.switchToRpc() as any).args[2];
         ctx = call.request.ctx;
      }
      await ctx?.session?.abortTransaction();
      await ctx?.session?.endSession();
      if (ctx?.rollback) await ctx?.rollback();

      if (host.getType() === 'rpc')
         return {
            code: err.error === 'Forbidden resource' ? 403 : err.status ?? 500,
            message: err.message ?? 'Internal Server Error',
         };
   }
}
