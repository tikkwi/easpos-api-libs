import { Metadata } from '@grpc/grpc-js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { base64 } from '@common/utils/misc';
import AppRedisService from '../app_redis/app_redis.service';
import process from 'node:process';
import { EApp } from '../../utils/enum';
import { AUTHORIZATION, REQUESTED_APP } from '../../constant';
import { lastValueFrom } from 'rxjs';

@Injectable()
export default class AppBrokerService {
   constructor(private readonly db: AppRedisService) {}

   async request<T>({ action, app, cache = false, meta: mta, ...rest }: BrokerRequest): Promise<T> {
      const { key } = rest as any;
      const currentApp = process.env['APP'];
      const isCrossApp = !app || app !== currentApp;
      const usr = isCrossApp
         ? app === EApp.User
            ? process.env['USER_RPC_USR']
            : process.env['ADMIN_RPC_USR']
         : '';
      const pwd = isCrossApp
         ? app === EApp.User
            ? process.env['USER_RPC_PWD']
            : process.env['ADMIN_RPC_PWD']
         : '';
      const crossRequest = async () => {
         const meta = new Metadata();
         meta.add(REQUESTED_APP, currentApp);
         meta.add(AUTHORIZATION, `Basic ${base64(`${usr}:${pwd}`)}`);
         if (mta) Object.entries(mta).forEach(([key, value]: any) => meta.add(key, value));
         const { data, code, message } = (await lastValueFrom(action(meta))) as any;
         if (code) throw new InternalServerErrorException(message);
         return data as T;
      };

      if (isCrossApp) return cache ? await this.db.get(key, crossRequest) : await crossRequest();
      return action().then(({ data }) => data as T);
   }
}
