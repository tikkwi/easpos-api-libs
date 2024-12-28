import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { hours, minutes, ThrottlerModule } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { REDIS_DCT_CLIENT } from '@common/constant';
import CoreModule from './core.module';
import ThrottlerStorageRedis from '../redis_throttler_storage.service';

@Module({
   imports: [
      CoreModule,
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
         inject: [REDIS_DCT_CLIENT],
      }),
   ],
})
export default class CoreHttpModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(cookieParser.default()).forRoutes('*');
   }
}
