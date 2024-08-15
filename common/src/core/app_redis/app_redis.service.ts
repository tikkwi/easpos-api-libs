import { Inject, Injectable } from '@nestjs/common';
import { APP_MERCHANT, REDIS_LCL_CLIENT } from '@common/constant';
import { Redis } from 'ioredis';
import { decrypt, encrypt } from '@common/utils/encrypt';
import { isPeriodExceed } from '@common/utils/datetime';
import dayjs from 'dayjs';

@Injectable()
export class AppRedisService {
   constructor(@Inject(REDIS_LCL_CLIENT) private readonly db: Redis) {}

   async set(key: string, value: any) {
      await this.db.set(key, await encrypt(JSON.stringify({ data: value, expireIn: Date.now() })));
   }

   async get<T>(key: string, getFnc?: () => Promise<T> | T): Promise<T | undefined> {
      const d: any = await this.db.get(key).then((res) => decrypt(res));

      if (getFnc) {
         const [isExpire] = d ? isPeriodExceed(new Date(d.expireIn)) : [];
         if (isExpire || !d) {
            const data = await getFnc();
            if (data)
               await this.db.set(
                  key,
                  JSON.stringify({
                     data,
                     expireIn: dayjs().add(1, 'days').toDate().getTime(),
                  }),
               );
            return data;
         }
      }

      return (d?.data as T) ?? undefined;
   }

   async logout() {
      await this.db.del(...[APP_MERCHANT]);
   }
}
