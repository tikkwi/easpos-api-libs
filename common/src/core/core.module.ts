import {
   ENV,
   MONGO_URI,
   REDIS_CLIENT,
   REDIS_HOST,
   REDIS_LCL_CLIENT,
   REDIS_LCL_PWD,
   REDIS_LCL_USR,
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
            new Redis({
               host: config.get(REDIS_HOST),
               port: config.get(REDIS_PORT),
               username: config.get(REDIS_USR),
               password: config.get(REDIS_PASSWORD),
            }).on('error', (err) => {
               throw new InternalServerErrorException(err);
            }),
         inject: [ConfigService],
      },
      {
         provide: REDIS_LCL_CLIENT,
         useFactory: async (config: ConfigService, sharedClient: Redis) =>
            config.get(ENV) === 'dedicated'
               ? new Redis({
                    port: 6379,
                    username: config.get(REDIS_LCL_USR),
                    password: config.get(REDIS_LCL_PWD),
                 }).on('error', (err) => {
                    throw new InternalServerErrorException(err);
                 })
               : sharedClient,
         inject: [ConfigService, REDIS_CLIENT],
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
   exports: [REDIS_CLIENT, REDIS_LCL_CLIENT],
})
export class CoreModule {}
