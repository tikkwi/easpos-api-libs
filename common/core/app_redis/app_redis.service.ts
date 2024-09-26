import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_LCL_CLIENT } from '@common/constant';
import { decrypt, encrypt } from '@common/utils/encrypt';
import ContextService from '../context';
import { days } from '@nestjs/throttler';

@Injectable()
export default class AppRedisService {
   constructor(@Inject(REDIS_LCL_CLIENT) private readonly db: Redis) {}

   async set<K extends keyof AppCache>(key: K, value: AppCache[K], expire?: number) {
      await this.db.set(key, await encrypt(JSON.stringify({ data: value })));
      await this.db.expire(key, expire ?? days(1));
      ContextService.set({ [key]: value });
   }

   async get<K extends keyof AppCache>(
      key: K,
      getFnc?: () => Promise<AppCache[K]> | AppCache[K],
   ): Promise<AppCache[K] | undefined> {
      const d: any = await this.db.get(key).then((res) => decrypt(res));
      if (d) return d.data;

      if (getFnc) {
         const data = await getFnc();
         if (data) await this.set(key, data);
         return data;
      }
   }

   async update<K extends keyof AppCache>(
      key: K,
      updFnc: (data: AppCache[K]) => Promise<AppCache[K]>,
   ): Promise<AppCache[K]> {
      const updated = await updFnc(await this.get(key));
      await this.set(key, updated);
      return updated;
   }

   async logout() {
      await this.db.del(...['merchant']);
   }
}
