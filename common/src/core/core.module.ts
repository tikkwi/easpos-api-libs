import {
  MONGODB_URI,
  REDIS_CLIENT,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '@common/constant';
import { TransactionInterceptor } from '@common/interceptors/transaction.interceptor';
import {
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import * as cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import { join } from 'path';
import { ContextModule } from './context/context.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransformRequestMiddleware } from '@common/middleware/transform_request.middleware';
import { AuditModule } from '@shared/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService): MongooseModuleOptions => {
        return { uri: config.get(MONGODB_URI) };
      },
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ContextModule,
    TransactionModule,
    AuditModule,
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (config: ConfigService) => {
        const client = await new Redis({
          host: config.get<string>(REDIS_HOST),
          port: config.get<number>(REDIS_PORT),
          password: config.get<string>(REDIS_PASSWORD),
        });
        client.on('error', (err) => {
          console.error('Redis Client Error');
          throw new InternalServerErrorException(err);
        });
        return client;
      },
      inject: [ConfigService],
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AppThrottleGuard,
    // },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
    consumer.apply(TransformRequestMiddleware).forRoutes('*');

    // consumer
    //   .apply(BasicAuthMiddleware)
    //   .forRoutes('/^.*/swagger$/', '/^.*/login$/', '/^.*/register$/');
  }
}
