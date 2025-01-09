import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import AppBrokerModule from '../app_broker/app_broker.module';
import AppRedisModule from '../app_redis/app_redis.module';
import TransactionInterceptor from '../../interceptor/transaction.interceptor';
import TransformGuard from '../../guard/transform.guard';
import AppExceptionFilter from '../exception.filter';

@Module({
   imports: [AppRedisModule, AppBrokerModule],
   providers: [
      { provide: APP_GUARD, useClass: TransformGuard },
      { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
      { provide: APP_FILTER, useClass: AppExceptionFilter },
      // { provide: APP_PIPE, useClass: TransformPayloadPipe },
      {
         provide: APP_PIPE,
         useFactory: () =>
            new ValidationPipe({
               transform: true,
               forbidNonWhitelisted: true,
               whitelist: true,
            }),
      },
   ],
})
export default class CoreModule {}
