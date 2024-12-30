import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@common/constant';
import AppRedisService from './app_redis.service';
import process from 'node:process';

@Global()
@Module({
   providers: [
      AppRedisService,
      {
         provide: REDIS_CLIENT,
         useFactory: async () => {
            const isDev = process.env['ENV'] === 'dev';
            return new Redis({
               host: isDev ? undefined : process.env['REDIS_HOST'],
               port: isDev ? 6379 : +process.env['REDIS_PORT'],
               username: process.env[`REDIS${isDev ? '_LCL' : ''}_USR`],
               password: process.env[`REDIS${isDev ? '_LCL' : ''}_PWD`],
            }).on('error', (err) => {
               console.error('Shared Redis:', err);
               // throw new InternalServerErrorException(err);
            });
         },
      },
   ],
   exports: [AppRedisService, REDIS_CLIENT],
})
export default class AppRedisModule {}
