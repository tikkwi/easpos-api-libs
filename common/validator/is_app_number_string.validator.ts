import {
   registerDecorator,
   ValidationArguments,
   ValidationOptions,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsNumberStringConstraint implements ValidatorConstraintInterface {
   validate(value: any, { constraints }: ValidationArguments): boolean {
      return typeof value === 'string' && new RegExp(`^[0-9]{${constraints[0] ?? 6}$`).test(value);
   }

   defaultMessage({ constraints }: ValidationArguments): string {
      return `The value must be a number string with length ${constraints[0] ?? 6}`;
   }
}

export function IsAppNumberString(length?: number, options?: ValidationOptions) {
   return function ({ constructor }: any, propertyName: string) {
      registerDecorator({
         target: constructor,
         propertyName,
         options,
         constraints: [length],
         validator: IsNumberStringConstraint,
      });
   };
}
