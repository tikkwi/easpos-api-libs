import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { responseError } from '@common/utils/misc';
import { ServerUnaryCall } from '@grpc/grpc-js';

@Catch()
export default class AppExceptionFilter implements ExceptionFilter {
   async catch(err: any, host: ArgumentsHost) {
      // const logger = new Logger(firstUpperCase(this.config.get(APP)));
      // logger.error(err);

      let session: ClientSession;
      if (host.getType() === 'http') {
         const ctx = host.switchToHttp();
         const response = ctx.getResponse<Response>();
         const request = ctx.getRequest<Request>();
         session = request.body.ctx?.session;
         responseError(request, response, err);
      } else {
         const call: ServerUnaryCall<any, any> = (host.switchToRpc() as any).args[2];
         session = call.request.ctx.session;
      }
      await session?.abortTransaction();
      await session?.endSession();
      if (host.getType() === 'rpc')
         return {
            code: err.error === 'Forbidden resource' ? 403 : err.status ?? 500,
            message: err.message ?? 'Internal Server Error',
         };
   }
}
