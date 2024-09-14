import 'reflect-metadata';
import { Controller } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { pull } from 'lodash';
import { AllowedApp, AllowedUser } from '@common/dto/core.dto';
import { APPS, SKIP_APPS, SKIP_USERS, USERS } from '@common/constant';
import ContextService from '../core/context.service';
import { Apps, Users } from './allowance.decorator';

type TAllowedUser = {
   [key in EApp | 'default']?: AllowedUser[];
};

export default function AppController(
   prefix?: string,
   allowedUsers?: TAllowedUser,
   allowedApps?: AllowedApp[],
) {
   return function (target: any) {
      Controller(prefix)(target);
      const reflector = new Reflector();
      const clsUsers = [];
      if (allowedUsers) {
         if (allowedUsers.default) clsUsers.splice(0, 0, ...allowedUsers.default);
         if (allowedUsers[ContextService.get('d_app')])
            clsUsers.splice(0, 0, ...allowedUsers[ContextService.get('d_app')]);
      }

      for (const key of Object.getOwnPropertyNames(target.prototype)) {
         const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
         const originalMethod = descriptor?.value;

         if (typeof originalMethod === 'function' && key !== 'constructor') {
            const users = [...(reflector.get(USERS, target.prototype[key]) ?? []), ...clsUsers];

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
