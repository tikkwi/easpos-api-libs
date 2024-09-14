import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { join } from 'path';
import { MONGO_URI } from '@common/constant';
import AppBrokerModule from '../app_broker/app_broker.module';
import AppRedisModule from '../app_redis/app_redis.module';
import TransformGuard from '../../guard/transform.guard';
import TransactionInterceptor from '../../interceptor/transaction.interceptor';
import AppExceptionFilter from '../exception.filter';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: join(process.cwd(), '.env'),
         isGlobal: true,
      }),
      MongooseModule.forRootAsync({
         useFactory: (config: ConfigService): MongooseModuleOptions => {
            return {
               uri: config.get(MONGO_URI),
            };
         },
         inject: [ConfigService],
      }),
      AppRedisModule,
      AppBrokerModule,
   ],
   providers: [
      { provide: APP_GUARD, useClass: TransformGuard },
      { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
      { provide: APP_FILTER, useClass: AppExceptionFilter },
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
