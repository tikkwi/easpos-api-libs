import {
  EXCEED_LIMIT,
  MONGO_URI,
  REDIS_CLIENT,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '@common/constant';
import { AppThrottleGuard } from '@common/guard/app_throttle.guard';
import { AuthGuard } from '@common/guard/auth.guard';
import { TransactionInterceptor } from '@common/interceptors/transaction.interceptor';
import { getServiceToken } from '@common/utils/misc';
import {
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AddressModule } from '@shared/address/address.module';
import { AuditModule } from '@shared/audit/audit.module';
import { CategoryModule } from '@shared/category/category.module';
import { ExceedLimitModule } from '@shared/exceed_limit/exceed_limit.module';
import { ExceedLimitService } from '@shared/exceed_limit/exceed_limit.service';
import { MailModule } from '@shared/mail/mail.module';
import * as cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import { join } from 'path';
import { ContextModule } from './context/context.module';
import { TransactionModule } from './transaction/transaction.module';
import { AppExceptionFilter } from './exception.filter';

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

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ContextModule,
    TransactionModule,
    AddressModule,
    AuditModule,
    CategoryModule,
    ExceedLimitModule,
    MailModule,
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
    { provide: getServiceToken(EXCEED_LIMIT), useExisting: ExceedLimitService },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AppThrottleGuard,
    // },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
    // { provide: APP_FILTER, useClass: AppExceptionFilter },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser.default()).forRoutes('*');

    // consumer
    //   .apply(BasicAuthMiddleware)
    //   .forRoutes('/^.*/swagger$/', '/^.*/login$/', '/^.*/register$/');
  }
}
