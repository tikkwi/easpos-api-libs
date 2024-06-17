import { firstUpperCase } from '@common/utils';
import { GrpcMethod } from '@nestjs/microservices';

export function GrpcHandler() {
  return function (target: any) {
    for (const method of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(
        target.prototype,
        method,
      );
      GrpcMethod(
        `${target.name.replace('GrpcController', '')}Service`,
        firstUpperCase(method),
      )(target.prototype[method], method, descriptor);
    }
  };
}
