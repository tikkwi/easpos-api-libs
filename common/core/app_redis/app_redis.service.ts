import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@common/constant';
import { decrypt, encrypt } from '@common/utils/encrypt';
import { days, minutes } from '@nestjs/throttler';

/*
NOTE: cache authorized status up to 1 day which mean employee may able to
authorized 1 day max even if app_subscription is expired..
*/
@Injectable()
export default class AppRedisService {
   constructor(@Inject(REDIS_CLIENT) private readonly db: Redis) {}

   async getKey<K extends keyof AppCache>(key: K, merchantId?: string) {
      if (!key.startsWith('a_') && !merchantId) throw new Error('Invalid Key');
      return key.startsWith('a_') ? key : `${key}_${merchantId}`;
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
      const isKeyExist = await this.db.exists(k);
      let { data }: any = isKeyExist
         ? await this.db.get(k).then((res) => decrypt(res))
         : { data: undefined };

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
