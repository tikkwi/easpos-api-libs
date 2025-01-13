import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { base64 } from '@common/utils/misc';
import AppRedisService from '../app_redis/app_redis.service';
import process from 'node:process';
import { EApp } from '../../utils/enum';
import { AUTHORIZATION, REQUESTED_APP } from '../../constant';

@Injectable()
export default class AppBrokerService {
   constructor(private readonly db: AppRedisService) {}

   async request<T>({ action, app, cache = true, meta: mta, ...rest }: BrokerRequest): Promise<T> {
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
         meta.add(REQUESTED_APP, currentApp);
         meta.add(AUTHORIZATION, `Basic ${base64(`${usr}:${pwd}`)}`);
         if (mta) Object.entries(mta).forEach(([key, value]) => meta.add(key, value));
         const { data, code, message } = await $action(meta);
         if (code) throw new InternalServerErrorException(message);
         return data as T;
      };

      if (isCrossApp) return await (cache ? this.db.get(key, crossRequest) : crossRequest());
      return action().then(({ data }) => data) as T;
   }
}
