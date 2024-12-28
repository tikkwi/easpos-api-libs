import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import AppBrokerModule from '../app_broker/app_broker.module';
import AppRedisModule from '../app_redis/app_redis.module';
import TransformGuard from '../../guard/transform.guard';
import TransactionInterceptor from '../../interceptor/transaction.interceptor';
import AppExceptionFilter from '../exception.filter';
import { TransformPayloadPipe } from '../../pipe/transform_payload.pipe';
import process from 'node:process';

@Module({
   imports: [
      MongooseModule.forRootAsync({
         useFactory: (): MongooseModuleOptions => ({
            uri: process.env['MONGO_URI'],
         }),
      }),
      AppRedisModule,
      AppBrokerModule,
   ],
   providers: [
      { provide: APP_GUARD, useClass: TransformGuard },
      { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
      { provide: APP_FILTER, useClass: AppExceptionFilter },
      { provide: APP_PIPE, useClass: TransformPayloadPipe },
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
