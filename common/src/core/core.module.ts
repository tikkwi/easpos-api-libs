import {
   MONGO_URI,
   REDIS_CLIENT,
   REDIS_HOST,
   REDIS_PASSWORD,
   REDIS_PORT,
   REDIS_USR,
} from '@common/constant';
import { TransactionInterceptor } from '@common/interceptors/transaction.interceptor';
import { InternalServerErrorException, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { join } from 'path';
import { ContextModule } from './context/context.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransformGuard } from '@common/guard/transform.guard';
import { AppBrokerModule } from './app_broker/app_broker.module';
import { Redis } from 'ioredis';

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

      ContextModule,
      TransactionModule,
      AppBrokerModule,
   ],
   providers: [
      {
         provide: REDIS_CLIENT,
         useFactory: async (config: ConfigService) =>
            new Redis(
               `redis://${config.get(REDIS_USR)}:${config.get(REDIS_PASSWORD)}@${config.get(REDIS_HOST)}:${config.get(REDIS_PORT)}`,
            ).on('error', (err) => {
               console.error('Redis Client Error');
               throw new InternalServerErrorException(err);
            }),
         inject: [ConfigService],
      },
      { provide: APP_GUARD, useClass: TransformGuard },
      { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
      // { provide: APP_FILTER, useClass: AppExceptionFilter },
      {
         provide: APP_PIPE,
         useFactory: () =>
            new ValidationPipe({
               transform: true,
               forbidNonWhitelisted: true,
            }),
      },
   ],
   exports: [REDIS_CLIENT],
})
export class CoreModule {}
