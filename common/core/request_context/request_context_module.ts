import { Global, Module } from '@nestjs/common';
import RequestContextService from './request_context_service';

@Global()
@Module({
   providers: [RequestContextService],
   exports: [RequestContextService],
})
export class RequestContextModule {}
