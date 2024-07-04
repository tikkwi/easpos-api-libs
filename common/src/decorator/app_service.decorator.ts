import 'reflect-metadata';
import { FORBIDDEN_USERS, USERS } from '@common/constant';
import { AllowedUser } from '@common/dto/core.dto';
import { Controller, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { pull } from 'lodash';
import { Users } from './users.decorator';
import { ContextService } from '@common/core/context/context.service';

export function AppService() {
  return function (target: any) {
    Injectable(target);

    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      const oriMeth = descriptor.value;
      if (typeof oriMeth === 'function' && key !== 'constructor') {
        descriptor.value = async function (...args) {
          console.log('hello', this.context);
          return oriMeth.apply();
        };
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }

    return target;
  };
}
