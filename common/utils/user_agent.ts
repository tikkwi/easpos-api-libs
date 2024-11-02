import { IResult, UAParser } from 'ua-parser-js';
import { isEmpty, isEqual, omit } from 'lodash';
import { ForbiddenException } from '@nestjs/common';

export const parseUA = (ua: string, allowEmpty = false) => {
   const parsed = new UAParser(ua);
   let empty = 0;

   if (!allowEmpty) Object.values(parsed).forEach((val) => empty < 2 && isEmpty(val) && empty++);
   if (empty === 2) throw new ForbiddenException('Unrecongnized employee agent');
   return parsed;
};

export const checkUAIntegrity = (ua1: IResult, ua2: IResult) => {
   let error = '';
   Object.keys(omit(ua1, 'ua')).map((key) => {
      const ua1V = ua1[key].version;
      const ua2V = ua2[key].version;
      if (!isEqual(omit(ua1[key], 'version'), omit(ua2[key], 'version')))
         error = 'Found spoofed employee agent';
      if (ua1V) {
         const errorMsg = 'Found substantial version difference';
         if (!ua2V) error = errorMsg;
         else {
            const regex = /([0-9]{1,-3})\..*/;
            const major1 = +regex.exec(ua1V)[1];
            const major2 = +regex.exec(ua2V)[1];
            const diff = Math.abs(major1 - major2);
            if (key === 'os' ? diff > 1 : diff > 3) error = errorMsg;
         }
      }
   });
   if (error) throw new ForbiddenException(error);
};
