import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { transformToRpcMethod } from '../utils/regex';

export default function GrpcHandler() {
   return function (target: any) {
      Controller()(target);

      for (const method of Object.getOwnPropertyNames(target.prototype)) {
         const descriptor = Reflect.getOwnPropertyDescriptor(target.prototype, method);
         const oriMeth = descriptor.value;

         if (typeof oriMeth === 'function' && method !== 'constructor')
            GrpcMethod(
               `${target.name.replace('GrpcController', '')}Service`,
               transformToRpcMethod(method),
            )(target.prototype[method], method, descriptor);
      }
   };
}
