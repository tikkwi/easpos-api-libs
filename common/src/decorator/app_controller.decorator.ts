import 'reflect-metadata';
import { FORBIDDEN_USERS, USERS } from '@common/constant';
import { AllowedUser } from '@common/dto/core.dto';
import { Controller } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { pull } from 'lodash';
import { Users } from './users.decorator';

//TODO: create decorator & concat Users with nethod decorators using nest first party helpers(setMetadata etc.,)
export function AppController(prefix?: string, allowedUsers?: AllowedUser[]) {
   return function (target: any) {
      Controller(prefix)(target);
      // const reflector = new Reflector()

      // for (const key of originalMethodKeys) {
      //   const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      //   const originalMethod = descriptor?.value;

      //   if (typeof originalMethod === 'function' && !['constructor', 'action'].includes(key)) {
      //     const users = [
      //       ...(reflector.get(USERS, target.prototype[key]) ?? []),
      //       ...(allowedUsers ?? []),
      //     ];
      //     const serviceForbidden = reflector.get(FORBIDDEN_USERS, target.prototype[key]);
      //     if (serviceForbidden) pull(users, ...serviceForbidden);
      //     if (users.length) Users(users)(target.prototype[key], key, descriptor);
      //   }
      // }

      return target;
   };
}
