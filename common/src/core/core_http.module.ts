import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AddressModule } from '@shared/address/address.module';
import { CategoryModule } from '@shared/category/category.module';
import { MailModule } from '@shared/mail/mail.module';
import * as cookieParser from 'cookie-parser';
import { CoreModule } from './core.module';
import { hours, minutes, ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_LCL_CLIENT, TRT_TRS_HVY_F, TRT_TRS_HVY_S, TRT_TRS_HVY_T } from '@common/constant';
import { ThrottlerStorageRedis } from '@common/core/redis_throttler_storage.service';

@Module({
   imports: [
      CoreModule,
      ThrottlerModule.forRootAsync({
         imports: [CoreModule],
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
      AddressModule,
      CategoryModule,
      MailModule,
   ],
})
export class CoreHttpModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(cookieParser.default()).forRoutes('*');
   }
}
