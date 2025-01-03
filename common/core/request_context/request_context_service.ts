import { Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { Request } from 'express';
import { ClientSession, createConnection } from 'mongoose';
import { RequestLog } from '@shared/audit/audit.schema';
import AppContext from '../app_context.service';
import { CONNECTION_POOL } from '../../constant';
import { getMongoUri } from '../../utils/misc';

type UpdateContextType = { logTrail: Array<RequestLog> };

type SetContextType = UpdateContextType & {
   user: AuthUser;
   merchant: AuthMerchant;
   ip: string;
   requestedApp: EApp;
   userAgent: string;
};

type GetContextType = SetContextType & {
   request?: Request;
   session: ClientSession;
};

@Injectable({ scope: Scope.REQUEST })
export default class RequestContextService {
   #session: ClientSession;
   #ip: string;
   #requestedApp: string;
   #userAgent: EApp;
   #logTrail: Array<RequestLog> = [];

   constructor() {}

   getConnection() {
      const id = this.get('user')?.merchantId;
      if (id) {
         if (CONNECTION_POOL.has(id)) return CONNECTION_POOL.get(id);
         const conn = createConnection(getMongoUri(id));
         CONNECTION_POOL.set(id, conn);
         return conn;
      }
      return AppContext.get('connection');
   }

   async startSession() {
      if (this.#session) throw new InternalServerErrorException('Session Already Initialized..');
      this.#session = await this.getConnection().startSession();
   }

   get<K extends keyof GetContextType>(key: K): GetContextType[K] {
      return Object.hasOwn(this, key) ? this[key as any] : this[`#${key}` as any];
   }

   set<K extends keyof SetContextType>(data: Record<K, SetContextType[K]>) {
      for (const [k, v] of Object.entries(data)) {
         if (Object.hasOwn(this, k)) this[k as any] = v;
         else this[`#${k}` as any] = v;
      }
   }

   update<K extends keyof UpdateContextType>(
      key: K,
      updFun: (val: UpdateContextType[K]) => UpdateContextType[K],
   ) {
      if (!Object.hasOwn(this, key)) throw new InternalServerErrorException(`${key} not found..`);
      this.set({ [key]: updFun(this.get(key)) } as any);
   }
}
