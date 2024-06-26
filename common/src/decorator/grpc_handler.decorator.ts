import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export function GrpcHandler() {
  return function (target: any) {
    Controller()(target);
    for (const method of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(
        target.prototype,
        method,
      );
      const oriMeth = descriptor.value;
      if (typeof oriMeth === 'function' && method !== 'constructor')
        GrpcMethod(
          `${target.name.replace('GrpcController', '')}Service`,
          method,
        )(target.prototype[method], method, descriptor);
    }
  };
}
