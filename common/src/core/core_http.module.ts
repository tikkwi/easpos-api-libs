import {
  APP_CONTEXT,
  EXCEED_LIMIT,
  REDIS_CLIENT,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '@common/constant';
import { AppThrottleGuard } from '@common/guard/app_throttle.guard';
import { AuthGuard } from '@common/guard/auth.guard';
import { BasicAuthMiddleware } from '@common/middleware/basic_auth.middleware';
import { getServiceToken } from '@common/utils/misc';
import {
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AddressModule } from '@shared/address/address.module';
import { AuditModule } from '@shared/audit/audit.module';
import { CategoryModule } from '@shared/category/category.module';
import { ExceedLimitModule } from '@shared/exceed_limit/exceed_limit.module';
import { ExceedLimitService } from '@shared/exceed_limit/exceed_limit.service';
import { MailModule } from '@shared/mail/mail.module';
import * as cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import { ContextService } from './context/context.service';
import { CoreModule } from './core.module';

@Module({
  imports: [
    CoreModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AddressModule,
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AppThrottleGuard,
    },
    { provide: getServiceToken(EXCEED_LIMIT), useExisting: ExceedLimitService },
    { provide: APP_CONTEXT, useExisting: ContextService },
  ],
})
export class CoreHttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser.default()).forRoutes('*');

    consumer
      .apply(BasicAuthMiddleware)
      .forRoutes('/^.*/swagger$/', '/^.*/login$/', '/^.*/register$/');
  }
}
