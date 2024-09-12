import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { hours, minutes, ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_LCL_CLIENT, TRT_TRS_HVY_F, TRT_TRS_HVY_S, TRT_TRS_HVY_T } from '@common/constant';
import CoreModule from './core.module';
import ThrottlerStorageRedis from '../redis_throttler_storage.service';

@Module({
   imports: [
      CoreModule,
      ThrottlerModule.forRootAsync({
         useFactory: async (config: ConfigService, client: Redis) => {
            return {
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
            };
         },
         inject: [ConfigService, REDIS_LCL_CLIENT],
      }),
   ],
})
export default class CoreHttpModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(cookieParser.default()).forRoutes('*');
   }
}
