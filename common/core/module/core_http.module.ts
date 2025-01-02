import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { hours, minutes, ThrottlerModule } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@common/constant';
import ThrottlerStorageRedis from '../redis_throttler_storage.service';
import { RequestContextModule } from '../request_context/request_context_module';
import BaseModule from '../base/base.module';
import CategoryModule from '@shared/category/category.module';

@Module({
   imports: [
      RequestContextModule,
      BaseModule,
      CategoryModule,
      ThrottlerModule.forRootAsync({
         useFactory: async (client: Redis) => {
            return {
               throttlers: [
                  {
                     ttl: minutes(1),
                     limit: +process.env['TRT_Q'],
                  },
                  {
                     ttl: minutes(30),
                     limit: +process.env['TRT_M'],
                  },
                  {
                     ttl: hours(3),
                     limit: +process.env['TRT_L'],
                  },
               ],
               storage: new ThrottlerStorageRedis(client),
            };
         },
         inject: [REDIS_CLIENT],
      }),
   ],
})
export default class CoreHttpModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(cookieParser.default()).forRoutes('*');
   }
}
