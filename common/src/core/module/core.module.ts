import { MONGO_URI } from '@common/constant';
import { TransactionInterceptor } from '@common/interceptors/transaction.interceptor';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { join } from 'path';
import { ContextModule } from '../context/context.module';
import { TransactionModule } from '../transaction/transaction.module';
import { TransformGuard } from '@common/guard/transform.guard';
import { AppBrokerModule } from '../app_broker/app_broker.module';
import { AppRedisModule } from '@common/core/app_redis/app_redis.module';

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
      ContextModule,
      TransactionModule,
      AppBrokerModule,
   ],
   providers: [
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
})
export class CoreModule {}
