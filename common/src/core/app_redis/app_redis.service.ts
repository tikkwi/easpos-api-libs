import { Inject, Injectable } from '@nestjs/common';
import { REDIS_LCL_CLIENT } from '@common/constant';
import { Redis } from 'ioredis';
import { decrypt } from '@common/utils/encrypt';

@Injectable()
export class AppRedisService {
   constructor(@Inject(REDIS_LCL_CLIENT) private readonly db: Redis) {}

   async get<T>(key: string, parse?: 'boolean' | 'json'): Promise<T | undefined> {
      let d: any = await this.db.get(key).then((data) => decrypt(data));

      if (parse && d) {
         switch (parse) {
            case 'boolean':
               d = d === 'true';
               break;
            case 'json':
               d = JSON.parse(d);
               break;
         }
      }
      return d ? (d as T) : undefined;
   }
}
