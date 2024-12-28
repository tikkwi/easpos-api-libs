import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { base64 } from '@common/utils/misc';
import { decrypt } from '@common/utils/encrypt';
import AppRedisService from '../app_redis/app_redis.service';
import process from 'node:process';
import { EApp } from '../../utils/enum';

@Injectable()
export default class AppBrokerService {
   constructor(private readonly db: AppRedisService) {}

   async request<T>({ action, app, cache = true, ...rest }: BrokerRequest): Promise<T> {
      const { key } = rest as any;
      const currentApp = process.env['APP'];
      const isCrossApp = !app || app !== currentApp;
      const usr = isCrossApp
         ? app === EApp.User
            ? process.env['USER_USR']
            : process.env['ADMIN_USR']
         : '';
      const pwd = isCrossApp
         ? app === EApp.User
            ? process.env['USER_PWD']
            : process.env['ADMIN_PWD']
         : '';
      const $action = isCrossApp ? (meta) => lastValueFrom(action(meta)) : action;

      const crossRequest = async () => {
         const meta = new Metadata();
         meta.add('app', currentApp);
         meta.add('authorization', `Basic ${base64(`${usr}:${pwd}`)}`);
         const { data, code, message } = await $action(meta);
         if (code) throw new InternalServerErrorException(message);
         return (await decrypt(data)) as T;
      };

      if (isCrossApp) return await (cache ? this.db.get(key, crossRequest) : crossRequest());
      return action().then(({ data }) => data) as T;
   }
}
