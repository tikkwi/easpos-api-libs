import { ADM_MRO_PWD, ADM_MRO_USR, APP } from '@common/constant';
import { base64 } from '@common/utils/misc';
import { Metadata } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import { ContextService } from '../context/context.service';
import { lastValueFrom } from 'rxjs';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';

export class AppBrokerService {
   constructor(
      private readonly context: ContextService,
      private readonly config: ConfigService,
      private readonly db: AppRedisService,
   ) {}

   async request<T>(
      isBasicAuth: boolean,
      action: (meta?: Metadata) => Promise<any> | any,
      key: string,
      app?: EApp,
   ): Promise<T> {
      const isCrossApp = !app || app !== this.config.get(APP);
      const $action = isCrossApp ? (meta) => lastValueFrom(action(meta)) : action;

      const crossRequest = async () => {
         const req = this.context.get('request');
         const res = this.context.get('response');
         const meta = new Metadata();
         meta.add('app', this.config.get(APP));
         meta.add(
            'authorization',
            isBasicAuth
               ? `Basic ${base64(`${this.config.get(ADM_MRO_USR)}:${this.config.get(ADM_MRO_PWD)}`)}`
               : req.session[`${app}_tkn`],
         );
         const { data, token, code, message } = await $action(meta);
         if (token) req.session[`${app}_tkn`] = token;
         if (code) return res.status(code).send({ message }) as T;
         return data;
      };

      if (isCrossApp) return await this.db.get<T>(key, crossRequest);
      return action().then(({ data }) => data) as T;
   }
}
