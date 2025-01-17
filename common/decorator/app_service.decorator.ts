import { Injectable } from '@nestjs/common';
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
