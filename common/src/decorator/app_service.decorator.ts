import { Injectable } from '@nestjs/common';

export function AppService() {
  return function (target: any) {
    Injectable()(target);
    const originalMethodKeys = Object.getOwnPropertyNames(target.prototype);

    for (const key of originalMethodKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      const originalMethod = descriptor?.value;

      if (typeof originalMethod === 'function' && key !== 'getRepository') {
        descriptor!.value = async function (...args) {
          if (args[0].newTransaction)
            return await this.transaction.makeTransaction(originalMethod(args));
          return originalMethod(args);
        };

        Object.defineProperty(target.prototype, key, descriptor);
      }
    }

    return target;
  };
}
