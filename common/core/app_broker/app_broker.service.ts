import { Metadata } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ADM_MRO_PWD, ADM_MRO_USR, APP } from '@common/constant';
import { base64 } from '@common/utils/misc';
import { decrypt } from '@common/utils/encrypt';
import AppRedisService from '../app_redis/app_redis.service';

@Injectable()
export default class AppBrokerService {
   constructor(
      private readonly config: ConfigService,
      private readonly db: AppRedisService,
   ) {}

   async request<T>({ action, app, cache = true, ...rest }: BrokerRequest): Promise<T> {
      const { key } = rest as any;
      const isCrossApp = !app || app !== this.config.get(APP);
      const $action = isCrossApp ? (meta) => lastValueFrom(action(meta)) : action;

      const crossRequest = async () => {
         const meta = new Metadata();
         meta.add('app', this.config.get(APP));
         meta.add(
            'authorization',
            `Basic ${base64(`${this.config.get(ADM_MRO_USR)}:${this.config.get(ADM_MRO_PWD)}`)}`,
         );
         const { data, code, message } = await $action(meta);
         if (code) throw new InternalServerErrorException(message);
         return (await decrypt(data)) as T;
      };

      if (isCrossApp) return await (cache ? this.db.get(key, crossRequest) : crossRequest());
      return action().then(({ data }) => data) as T;
   }
}
