import { ADM_MRO_PWD, ADM_MRO_USR, APP } from '@common/constant';
import { base64 } from '@common/utils/misc';
import { Metadata } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ContextService } from '../context/context.service';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppBrokerService {
   constructor(
      private readonly context: ContextService,
      private readonly config: ConfigService,
   ) {}

   async request(action: (meta?: Metadata) => Promise<any> | any, isBasicAuth: boolean, app: EApp) {
      const isCrossApp = app !== this.config.get(APP);
      const $action = isCrossApp ? (meta) => lastValueFrom(action(meta)) : action;

      if (isCrossApp) {
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
         if (code) return res.status(code).send({ message });
         return data;
      }

      return action().then(({ data }) => data);
   }
}
