import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { isEmpty, omit } from 'lodash';
import { Reflector } from '@nestjs/core';
import { SKIP } from '../constant';

export default function AppService() {
   return function (target: any) {
      Injectable()(target);
      const reflector = new Reflector();
      const parent = Object.getPrototypeOf(target.prototype);

      for (const key of [
         ...(isEmpty(parent) ? [] : Object.getOwnPropertyNames(parent)),
         ...Object.getOwnPropertyNames(target.prototype),
      ]) {
         if (reflector.get(SKIP, target.prototype[key])) continue;

         const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
         const oriMeth = descriptor.value;
         if (typeof oriMeth === 'function' && !['constructor', 'onModuleInit'].includes(key)) {
            descriptor.value = async function (...args) {
               const context: RequestContext | undefined = args[0].ctx;

               const res = await oriMeth.apply(this, args);
               if (context)
                  context.logTrail.push({
                     service: target.name,
                     auxiliaryService: key,
                     payload: omit(args[0], 'ctx'),
                     response: res,
                  });
               return res;
            };
            Object.defineProperty(target.prototype, key, descriptor);
         }
      }

      return target;
   };
}
