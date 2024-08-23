import 'reflect-metadata';
import { APPS, SKIP_APPS, SKIP_USERS, USERS } from '@constant/decorator.constant';
import { AllowedApp, AllowedUser } from '@global_dto/core.dto';
import { Controller } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { pull } from 'lodash';
import { Users } from './users.decorator';
import { Apps } from '@decorator/app.decorator';

export function AppController(
   prefix?: string,
   allowedUsers?: AllowedUser[],
   allowedApps?: AllowedApp[],
) {
   return function (target: any) {
      Controller(prefix)(target);
      const reflector = new Reflector();

      for (const key of Object.getOwnPropertyNames(target.prototype)) {
         const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
         const originalMethod = descriptor?.value;

         if (typeof originalMethod === 'function' && key !== 'constructor') {
            const users = [
               ...(reflector.get(USERS, target.prototype[key]) ?? []),
               ...(allowedUsers ?? []),
            ];
            const apps = [
               ...(reflector.get(APPS, target.prototype[key]) ?? []),
               ...(allowedApps ?? []),
            ];
            const skippedUsers = reflector.get(SKIP_USERS, target.prototype[key]);
            const skippedApps = reflector.get(SKIP_APPS, target.prototype[key]);
            if (skippedUsers) pull(users, ...skippedUsers);
            if (skippedApps) pull(apps, ...skippedApps);
            if (users.length) Users(users)(target.prototype[key], key, descriptor);
            if (apps.length) Apps(apps)(target.prototype[key], key, descriptor);
         }
      }

      return target;
   };
}
