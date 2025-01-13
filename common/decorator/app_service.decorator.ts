import { ForbiddenException, Injectable } from '@nestjs/common';
import { omit } from 'lodash';

export default function AppService() {
   return function (target: any) {
      Injectable()(target);

      for (const key of Object.getOwnPropertyNames(target.prototype)) {
         const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
         const oriMeth = descriptor.value;
         if (typeof oriMeth === 'function' && key !== 'constructor') {
            descriptor.value = async function (...args) {
               const context: RequestContext = args[0].ctx;
               const ct = args[0].ct;
               if (
                  (key.startsWith('nc_') && ct) ||
                  (ct &&
                     ((key.startsWith('nht_') && ct === 'http') ||
                        (key.startsWith('nrp_') && ct === 'rpc')))
               )
                  throw new ForbiddenException();
               const res = await oriMeth.apply(this, args);
               context.logTrail.push({
                  service: target.name,
                  auxiliaryService: key,
                  payload: omit(args[0], 'context'),
                  response: res,
               });
               return res;
            };
            Object.defineProperty(target.prototype, key, descriptor);
         }
      }

      return target;
   };
}
