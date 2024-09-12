import {
   registerDecorator,
   ValidationArguments,
   ValidationOptions,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';
import { omit, pick } from 'lodash';

@ValidatorConstraint({ async: false })
class IsAppEnumConstraint implements ValidatorConstraintInterface {
   validate(value: any, { constraints }: ValidationArguments): boolean {
      let e = constraints[0];
      const filter = constraints[1];
      if (filter?.pick) e = pick(e, filter.pick);
      if (filter?.omit) e = omit(e, filter.omit);
      return e.hasOwnProperty(value);
   }

   defaultMessage({ constraints }: ValidationArguments): string {
      return `The value must be ${constraints[0]}`;
   }
}

export default function IsAppEnum<E>(
   e: E,
   filter?: { omit?: (keyof E)[]; pick?: (keyof E)[] },
   options?: ValidationOptions,
) {
   return function ({ constructor }: any, propertyName: string) {
      registerDecorator({
         target: constructor,
         propertyName,
         options,
         constraints: [e, filter],
         validator: IsAppEnumConstraint,
      });
   };
}
