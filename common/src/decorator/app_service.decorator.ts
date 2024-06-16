import { Injectable } from '@nestjs/common';

export function AppService() {
  return function (target: any) {
    Injectable()(target);
    const originalMethodKeys = Object.getOwnPropertyNames(target.prototype);

    for (const key of originalMethodKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      const originalMethod = descriptor?.value;

      if (typeof originalMethod === 'function' && key !== 'getRepository') {
        descriptor!.value = async function (dto, meta) {
          const request = JSON.parse(meta.req);
          await target.getRepository(request);
          originalMethod.apply(this, [dto, { ...meta, request }]);
        };

        Object.defineProperty(target.prototype, key, descriptor);
      }
    }

    return target;
  };
}
