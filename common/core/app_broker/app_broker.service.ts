import { ADM_MRO_PWD, ADM_MRO_USR, APP } from '@constant/config.constant';
import { base64 } from '@utils/misc';
import { Metadata } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import { ContextService } from '../context/context.service';
import { lastValueFrom } from 'rxjs';
import { AppRedisService } from '@core/app_redis/app_redis.service';
import { decrypt } from '@utils/encrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppBrokerService {
   constructor(
      private readonly context: ContextService,
      private readonly config: ConfigService,
      private readonly db: AppRedisService,
   ) {}

   async request<T>({ action, app, cache, ...rest }: BrokerRequest): Promise<T> {
      const { key } = rest as any;
      const isCrossApp = !app || app !== this.config.get(APP);
      const $action = isCrossApp ? (meta) => lastValueFrom(action(meta)) : action;

      const crossRequest = async () => {
         const res = this.context.get('response');
         const meta = new Metadata();
         meta.add('app', this.config.get(APP));
         meta.add(
            'authorization',
            `Basic ${base64(`${this.config.get(ADM_MRO_USR)}:${this.config.get(ADM_MRO_PWD)}`)}`,
         );
         const { data, code, message } = await $action(meta);
         if (code) return res.status(code).send({ message }) as T;
         return (await decrypt(data)) as T;
      };

      if (isCrossApp) return await (cache ? this.db.get(key, crossRequest) : crossRequest());
      return action().then(({ data }) => data) as T;
   }
}
