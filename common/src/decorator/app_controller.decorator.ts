import { FORBIDDEN_USERS, USERS } from '@common/constant';
import { Users } from '@common/decorator';
import { AllowedUser } from '@common/dto';
import { Controller } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { pull } from 'lodash';

export function AppController(prefix?: string, allowedUsers?: AllowedUser[]) {
  return function (target: any) {
    const reflector = new Reflector();

    Controller(prefix)(target);
    const originalMethodKeys = Object.getOwnPropertyNames(target.prototype);

    for (const key of originalMethodKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      const originalMethod = descriptor?.value;

      if (typeof originalMethod === 'function') {
        const users = [
          ...(reflector.get(USERS, target.prototype[key]) ?? []),
          ...(allowedUsers ?? []),
        ];
        const serviceForbidden = reflector.get(FORBIDDEN_USERS, target.prototype[key]);
        if (serviceForbidden) pull(users, ...serviceForbidden);
        if (users.length) Users(users)(target.prototype[key], key, descriptor);

        descriptor!.value = async function (...args) {
          return await this.transaction.makeTransaction(originalMethod(args));
        };

        Object.defineProperty(target.prototype, key, descriptor);
      }
    }

    return target;
  };
}
