import { MONGO_URI, REDIS_CLIENT, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@common/constant';
import { TransactionInterceptor } from '@common/interceptors/transaction.interceptor';
import { InternalServerErrorException, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { join } from 'path';
import { ContextModule } from './context/context.module';
import { AppExceptionFilter } from './exception.filter';
import { TransactionModule } from './transaction/transaction.module';
import { AuditModule } from '@shared/audit/audit.module';
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
