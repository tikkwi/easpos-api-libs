import { firstUpperCase } from '@common/utils/regex';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export function GrpcHandler() {
  return function (target: any) {
    Controller()(target);
    for (const method of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target.prototype, method);
      GrpcMethod(`${target.name.replace('GrpcController', '')}Service`, firstUpperCase(method))(
        target.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
