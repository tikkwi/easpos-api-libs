import {
  APP_CONTEXT,
  REDIS_CLIENT,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  TRT_TRS_HVY_F,
  TRT_TRS_HVY_S,
  TRT_TRS_HVY_T,
} from '@common/constant';
import { AuthGuard } from '@common/guard/auth.guard';
import { BasicAuthMiddleware } from '@common/middleware/basic_auth.middleware';
import {
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, hours, minutes } from '@nestjs/throttler';
import { AddressModule } from '@shared/address/address.module';
import { CategoryModule } from '@shared/category/category.module';
import { MailModule } from '@shared/mail/mail.module';
import * as cookieParser from 'cookie-parser';
import { Redis } from 'ioredis';
import { ContextService } from './context/context.service';
import { CoreModule } from './core.module';
import { ThrottlerStorageRedis } from './redis_throttler_storage.service';

@Module({
  imports: [
    CoreModule,
    ThrottlerModule.forRootAsync({
      useFactory: (client: Redis, config: ConfigService) => ({
        throttlers: [
          {
            ttl: minutes(1),
            limit: config.get(TRT_TRS_HVY_F),
          },
          {
            ttl: minutes(30),
            limit: config.get(TRT_TRS_HVY_S),
          },
          {
            ttl: hours(3),
            limit: config.get(TRT_TRS_HVY_T),
          },
        ],
        storage: new ThrottlerStorageRedis(client),
      }),
      inject: [REDIS_CLIENT, ConfigService],
    }),
    AddressModule,
    CategoryModule,
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
