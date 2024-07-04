import { ContextService } from '@common/core/context/context.service';
import { Injectable } from '@nestjs/common';

export function AppService() {
  return function (target: any) {
    Injectable(target);

    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      const oriMeth = descriptor.value;
      if (typeof oriMeth === 'function' && key !== 'constructor') {
        descriptor.value = async function (...args) {
          const res = await oriMeth.apply(args);
          (this.context as ContextService).update('logTrail', (log) => {
            log.push({
              service: target.name,
              auxillaryService: key,
              payload: args[0],
              response: res,
            });
          });
          return res;
        };
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }

    return target;
  };
}
