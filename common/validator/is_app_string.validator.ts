import {
   registerDecorator,
   ValidationArguments,
   ValidationOptions,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';

type StringType = 'number' | 'include';
type StringOption<T extends StringType> = T extends 'number'
   ? { length?: number }
   : { arr: readonly string[] };

@ValidatorConstraint({ async: false })
class IsNumberStringConstraint implements ValidatorConstraintInterface {
   validate(value: any, { constraints }: ValidationArguments): boolean {
      const type: StringType = constraints[0];
      const option = constraints[1];
      return (
         typeof value === 'string' &&
         (type === 'number'
            ? new RegExp(`^[0-9]{${option.length ?? 6}}$`).test(value)
            : option && option.arr.includes(value))
      );
   }

   defaultMessage({ constraints }: ValidationArguments): string {
      return `The value must be a number string with length ${constraints[0] ?? 6}`;
   }
}

export function IsAppString<T extends StringType>(
   type: T,
   strOption?: StringOption<T>,
   options?: ValidationOptions,
) {
   return function ({ constructor }: any, propertyName: string) {
      registerDecorator({
         target: constructor,
         propertyName,
         options,
         constraints: [type, strOption],
         validator: IsNumberStringConstraint,
      });
   };
}
