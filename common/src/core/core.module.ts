import { AppThrottleGuard, AuthGuard } from '@common/guard';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

// const [client, services] = getGrpcClient([EXCEED_LIMIT, USER, MERCHANT, AUTH_CREDENTIAL]);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../../.env'),
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
    {
      provide: APP_GUARD,
      useClass: AppThrottleGuard,
    },
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
