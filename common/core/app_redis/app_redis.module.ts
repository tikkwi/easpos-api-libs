import { Global, InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import {
   ENV,
   REDIS_CLIENT,
   REDIS_HOST,
   REDIS_LCL_CLIENT,
   REDIS_LCL_PWD,
   REDIS_LCL_USR,
   REDIS_PASSWORD,
   REDIS_PORT,
   REDIS_USR,
} from '@common/constant';

@Global()
@Module({
   providers: [
      AppRedisService,
      {
         provide: REDIS_CLIENT,
         useFactory: async (config: ConfigService) =>
            new Redis({
               host: config.get(REDIS_HOST),
               port: config.get(REDIS_PORT),
               username: config.get(REDIS_USR),
               password: config.get(REDIS_PASSWORD),
            }).on('error', (err) => {
               throw new InternalServerErrorException(err);
            }),
         inject: [ConfigService],
      },
      {
         provide: REDIS_LCL_CLIENT,
         useFactory: async (config: ConfigService, sharedClient: Redis) =>
            config.get(ENV) === 'dedicated'
               ? new Redis({
                    port: 6379,
                    username: config.get(REDIS_LCL_USR),
                    password: config.get(REDIS_LCL_PWD),
                 }).on('error', (err) => {
                    throw new InternalServerErrorException(err);
                 })
               : sharedClient,
         inject: [ConfigService, REDIS_CLIENT],
      },
   ],
   exports: [AppRedisService, REDIS_CLIENT, REDIS_LCL_CLIENT],
})
export class AppRedisModule {}
