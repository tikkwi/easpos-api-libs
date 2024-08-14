import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcAuthType } from '@common/dto/core.dto';
import { Reflector } from '@nestjs/core';
import { GRPC_AUTH } from '@common/constant';
import { GrpcAuth } from '@common/decorator/grpc_auth.decorator';

export function GrpcHandler(auth: GrpcAuthType) {
   return function (target: any) {
      Controller()(target);
      const reflector = new Reflector();

      for (const method of Object.getOwnPropertyNames(target.prototype)) {
         const descriptor = Reflect.getOwnPropertyDescriptor(target.prototype, method);
         const oriMeth = descriptor.value;

         if (typeof oriMeth === 'function' && method !== 'constructor') {
            const methodAuth = reflector.get(GRPC_AUTH, target.prototype[method]);
            if (!methodAuth && auth) GrpcAuth(auth)(target.prototype[method], method, descriptor);
            GrpcMethod(`${target.name.replace('GrpcController', '')}Service`, method)(
               target.prototype[method],
               method,
               descriptor,
            );
         }
      }
   };
}
