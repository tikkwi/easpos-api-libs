import { Inject, Injectable } from '@nestjs/common';
import { REDIS_LCL_CLIENT } from '@common/constant';
import { Redis } from 'ioredis';
import { decrypt } from '@common/utils/encrypt';
import { isPeriodExceed } from '@common/utils/datetime';
import dayjs from 'dayjs';

@Injectable()
export class AppRedisService {
   constructor(@Inject(REDIS_LCL_CLIENT) private readonly db: Redis) {}

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
}
