import {
   isMongoId,
   isNumber,
   IsObject,
   isString,
   isURL,
   registerDecorator,
   ValidationArguments,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';
import { EType } from '../utils/enum';
import { isBoolean } from 'lodash';

@ValidatorConstraint({ async: false })
class IsRecordConstraint implements ValidatorConstraintInterface {
   validateType(value: any, type: EType, isArray: boolean) {
      const v = isArray ? value : [value];
      return v.every((v: any) => {
         if (type === EType.Number) return isNumber(v);
         if (type === EType.String) return isString(v);
         if (type === EType.Url) return isURL(v);
         if (type === EType.Id) return isMongoId(v);
         if (type === EType.Boolean) return isBoolean(v);
         return false;
      });
   }

   validate(value: any, { constraints }: ValidationArguments): boolean {
      const kT: EType | undefined = constraints[0];
      const vT: EType | undefined = constraints[1];
      const isArray: boolean = constraints[2];

      return (
         IsObject(value) &&
         Object.entries(value).every(([k, v]: any) => {
            return this.validateType(k, kT ?? EType.String, false) && vT
               ? this.validateType(v, vT, isArray)
               : true;
         })
      );
   }

   defaultMessage({ constraints }: ValidationArguments): string {
      return `The value must be a number string with length ${constraints[0] ?? 6}`;
   }
}

export function IsRecord<K extends EType.String | EType.Number, T extends EType>(
   value?: T,
   key?: K,
   isValueArray?: boolean,
) {
   return function ({ constructor }: any, propertyName: string) {
      registerDecorator({
         target: constructor,
         propertyName,
         constraints: [key, value, isValueArray],
         validator: IsRecordConstraint,
      });
   };
}
