import { AUTH_CREDENTIAL, EXCEED_LIMIT, MERCHANT, REDIS_CLIENT, USER } from '@app/constant';
import { AppExceptionFilter, MongooseConfigModule } from '@app/core';
import { AppThrottleGuard, AuthGuard } from '@app/guard';
import { getGrpcClient } from '@app/helper';
import { BasicAuthMiddleware, TransformRequestMiddleware } from '@app/middleware';
import { SharedModule } from '@app/shared';
import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as Redis from 'redis';

// const [client, services] = getGrpcClient([EXCEED_LIMIT, USER, MERCHANT, AUTH_CREDENTIAL]);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, '../.env'), join(__dirname, '../../.env')],
      isGlobal: true,
    }),
    // SharedModule,
    // ClientsModule.register(client),
  ],
  providers: [
    // ...services,
    // {
    //   provide: REDIS_CLIENT,
    //   useFactory: async () => await Redis.createClient().connect(),
    // },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AppThrottleGuard,
    // },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
    // consumer.apply(TransformRequestMiddleware).forRoutes('*');
    // consumer
    //   .apply(BasicAuthMiddleware)
    //   .forRoutes('/^/.*/swagger$/', '/^/.*/login$/', '/^/.*/register$/');
  }
}
