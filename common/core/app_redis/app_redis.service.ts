import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_LCL_CLIENT } from '@common/constant';
import { decrypt, encrypt } from '@common/utils/encrypt';
import { days, minutes } from '@nestjs/throttler';
import { ModuleRef } from '@nestjs/core';
import ContextService from '../context/context.service';

/*
NOTE: cache authorized status up to 1 day which mean employee may able to
authorized 1 day max even if subscription is expired..
*/
@Injectable()
export default class AppRedisService {
   constructor(
      @Inject(REDIS_LCL_CLIENT) private readonly db: Redis,
      private readonly moduleRef: ModuleRef,
   ) {}

   async getKey<K extends keyof AppCache>(key: K) {
      const context = await this.moduleRef.resolve(ContextService);
      return key.startsWith('a_') ? key : `${key}_${context.get('user').merchant}`;
   }

   async set<K extends keyof AppCache>(key: K, value: AppCache[K], expire?: number) {
      await this.db.set(
         await this.getKey(key),
         await encrypt(JSON.stringify({ data: value })),
         'PX',
         expire ?? key.startsWith('t_') ? minutes(5) : days(key.startsWith('a_') ? 30 : 1),
      );
   }

   async get<K extends keyof AppCache>(
      key: K,
      getFnc?: () => Promise<AppCache[K]> | AppCache[K],
      expire?: number,
      del?: boolean,
   ): Promise<AppCache[K] | undefined> {
      const k = await this.getKey(key);
      let { data }: any = await this.db.get(k).then((res) => decrypt(res));

      if (getFnc) {
         data = await getFnc();
         if (data) await this.set(key, data, expire);
      }

      if (del) this.db.del(k);

      return data;
   }

   async update<K extends keyof AppCache>(
      key: K,
      updFnc: (data: AppCache[K]) => Promise<AppCache[K]>,
   ): Promise<AppCache[K]> {
      const updated = await updFnc(await this.get(key));
      await this.set(key, updated);
      return updated;
   }
}
