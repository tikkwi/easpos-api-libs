import 'reflect-metadata';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { transformToRpcMethod } from '../utils/regex';
import { Reflector } from '@nestjs/core';
import { SKIP } from '../constant';
import { isEmpty } from 'lodash';

export default function GrpcHandler() {
   return function (target: any) {
      Controller()(target);
      const reflector = new Reflector();
      const parent = Object.getPrototypeOf(target.prototype);

      for (const key of [
         ...(isEmpty(parent) ? [] : Object.getOwnPropertyNames(parent)),
         ...Object.getOwnPropertyNames(target.prototype),
      ]) {
         if (reflector.get(SKIP, target.prototype[key])) continue;

         const descriptor = Reflect.getOwnPropertyDescriptor(target.prototype, key);
         const oriMeth = descriptor.value;

         if (typeof oriMeth === 'function' && key !== 'constructor')
            GrpcMethod(
               `${target.name.replace('GrpcController', '')}Service`,
               transformToRpcMethod(key),
            )(target.prototype[key], key, descriptor);
      }
   };
}
