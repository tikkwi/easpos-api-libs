import {
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppThrottleGuard, AuthGuard } from '@common/guard';
import { ContextModule } from '@common/core';
import { REDIS_CLIENT, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@common/constant';
import { Redis } from 'ioredis';
import { BasicAuthMiddleware, TransformRequestMiddleware } from '@common/middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'),
      isGlobal: true,
    }),
    ContextModule,
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
      // inject: [ConfigModule],
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AppThrottleGuard,
    },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('hello...', join(__dirname, '../..'));
    consumer.apply(cookieParser()).forRoutes('*');
    consumer.apply(TransformRequestMiddleware).forRoutes('*');
    consumer
      .apply(BasicAuthMiddleware)
      .forRoutes('/^/.*/swagger$/', '/^/.*/login$/', '/^/.*/register$/');
  }
}
