import { Injectable } from '@nestjs/common';
import ContextService from '../core/context/context.service';
import { omit } from 'lodash';

export default function AppService() {
   return function (target: any) {
      Injectable(target);

      for (const key of Object.getOwnPropertyNames(target.prototype)) {
         const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
         const oriMeth = descriptor.value;
         if (typeof oriMeth === 'function' && key !== 'constructor') {
            descriptor.value = async function (...args) {
               const res = await oriMeth.apply(this, args);
               const context: ContextService = this.args[0].context;
               context.update('logTrail', (log) => {
                  const reqLog = {
                     service: target.name,
                     auxiliaryService: key,
                     payload: omit(args[0], 'context'),
                     response: res,
                  };
                  if (log) log.push(reqLog);
                  else {
                     log = [reqLog];
                     return log;
                  }
               });
               return res;
            };
            Object.defineProperty(target.prototype, key, descriptor);
         }
      }

      return target;
   };
}
