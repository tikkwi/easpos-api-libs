import { Inject, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ClientSession } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { RequestLog } from '@shared/audit/audit.schema';
import CategoryService from '@shared/category/category.service';
import MerchantConfig from '@app/merchant_config/merchant_config.schema';

type UpdateContextType = { logTrail: Array<RequestLog> };

type SetContextType = UpdateContextType & {
   user: AuthUser;
   merchant: AuthMerchant;
   merchantConfig: AppSchema<MerchantConfig>;
   ip: string;
   requestedApp: EApp;
   userAgent: string;
};

type GetContextType = SetContextType & {
   request?: Request;
   session: ClientSession;
   categoryService: CategoryService;
};

@Injectable({ scope: Scope.REQUEST })
export default class ContextService {
   #session: ClientSession;
   #initialized = false;
   #user: AuthUser;
   #merchantConfig: AppSchema<MerchantConfig>;
   #ip: string;
   #requestedApp: string;
   #userAgent: EApp;
   #logTrail: Array<RequestLog> = [];

   constructor(
      @Inject(REQUEST) private readonly request: Request,
      @InjectConnection() private readonly connection: Connection,
      private readonly categoryService: CategoryService,
   ) {}

   async initialize() {
      if (this.#initialized)
         throw new InternalServerErrorException('Context Already Initialized..');
      this.#session = await this.connection.startSession();
   }

   get<K extends keyof GetContextType>(key: K): GetContextType[K] {
      this.#checkInitialization();
      return Object.hasOwn(this, key) ? this[key as any] : this[`#${key}` as any];
   }

   set<K extends keyof SetContextType>(data: Record<K, SetContextType[K]>) {
      this.#checkInitialization();
      for (const [k, v] of Object.entries(data)) {
         if (Object.hasOwn(this, k)) this[k as any] = v;
         else this[`#${k}` as any] = v;
      }
   }

   update<K extends keyof UpdateContextType>(
      key: K,
      updFun: (val: UpdateContextType[K]) => UpdateContextType[K],
   ) {
      this.#checkInitialization();
      if (!Object.hasOwn(this, key)) throw new InternalServerErrorException(`${key} not found..`);
      this.set({ [key]: updFun(this.get(key)) } as any);
   }

   #checkInitialization() {
      if (!this.#initialized) throw new InternalServerErrorException('Context Not Initialized..');
   }
}
