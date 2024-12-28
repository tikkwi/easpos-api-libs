import { Global, InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT, REDIS_DCT_CLIENT } from '@common/constant';
import AppRedisService from './app_redis.service';
import process from 'node:process';

@Global()
@Module({
   providers: [
      AppRedisService,
      {
         provide: REDIS_CLIENT,
         useFactory: async () =>
            new Redis({
               host: process.env['REDIS_HOST'],
               port: +process.env['REDIS_PORT'],
               username: process.env['REDIS_USR'],
               password: process.env['REDIS_PWD'],
            }).on('error', (err) => {
               console.error('Shared Redis:', err);
               // throw new InternalServerErrorException(err);
            }),
         inject: [ConfigService],
      },
      {
         provide: REDIS_DCT_CLIENT,
         useFactory: async (sharedClient: Redis) =>
            process.env['ENV'] === 'dedicated'
               ? new Redis({
                    port: 6379,
                    username: process.env['REDIS_DCT_USR'],
                    password: process.env['REDIS_DCT_PWD'],
                 }).on('error', (err) => {
                    throw new InternalServerErrorException(err);
                 })
               : sharedClient,
         inject: [REDIS_CLIENT],
      },
   ],
   exports: [AppRedisService, REDIS_CLIENT, REDIS_DCT_CLIENT],
})
export default class AppRedisModule {}
