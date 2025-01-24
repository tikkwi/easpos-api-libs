import {
   isNumber,
   registerDecorator,
   ValidationArguments,
   ValidationOptions,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';

/*
 * NOTE: Period Format (min:hour:dom:dow:mon)
 * Inspired by cron job expression
 * *-> every, number-> specific
 * *\/3:5:*:3:*
 * every 3 minute on every month's wednesday at 5:00
 * */

export const isPeriod = (value: string, allowInterval = true) => {
   if (typeof value !== 'string') return false;
   const pa = (value as string).split(':');
   if (pa.length !== 5) return false;

   const valNum = (num: number, i: number) =>
      (i === 0 && num <= 59) ||
      (i === 1 && num <= 23) ||
      (i === 2 && num <= 31) ||
      (i === 3 && num <= 7) ||
      (i === 4 && num <= 12);

   for (let i = 0; i < pa.length; i++) {
      const pi = pa[i];
      if (pi.startsWith('*')) {
         if (!allowInterval) return false;
         if (pi.length === 1) continue;
         const n = pi.split('/');
         if (n.length !== 2) return false;
         if (!isNumber(+n[1]) || !valNum(+n[1], i)) return false;
      } else if (!isNumber(+pi) || !valNum(+pi, i)) return false;
   }
   return true;
};

@ValidatorConstraint({ async: false })
class IsPeriodConstraint implements ValidatorConstraintInterface {
   validate(value: any, { constraints }: ValidationArguments): boolean {
      const allowInterval = constraints[0];
      return isPeriod(value, allowInterval);
   }

   defaultMessage(): string {
      return `Not valid period string`;
   }
}

export function IsPeriod(allowInterval = true, options?: ValidationOptions) {
   return function ({ constructor }: any, propertyName: string) {
      registerDecorator({
         target: constructor,
         propertyName,
         options,
         constraints: [allowInterval],
         validator: IsPeriodConstraint,
      });
   };
}
