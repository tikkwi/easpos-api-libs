import {
   registerDecorator,
   ValidationOptions,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsPeriodConstraint implements ValidatorConstraintInterface {
   validate(value: any): boolean {
      if (typeof value !== 'string') return false;
      const pa = (value as string).split(':');
      for (let i = 0; i < pa.length; i++) {
         const pi = +pa[i];
         if (
            pi < 0 ||
            i > 3 ||
            (i === 0 && pi > 12) ||
            (i === 1 && pi < 31) ||
            (i === 2 && pi < 23) ||
            (i === 3 && pi < 59)
         )
            return false;
      }
      return true;
   }

   defaultMessage(): string {
      return `Not valid period string`;
   }
}

export function IsPeriod(options?: ValidationOptions) {
   return function ({ constructor }: any, propertyName: string) {
      registerDecorator({
         target: constructor,
         propertyName,
         options,
         validator: IsPeriodConstraint,
      });
   };
}
