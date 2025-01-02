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

type IsRecordConstraintType<K, T> = {
   value?: T;
   key?: K;
   isValueArray?: boolean;
   keyVldFun?: (key: K) => boolean;
   valVldFun?: (val: T) => boolean;
};

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
      const { key: kT, value: vT, isValueArray: isArray, keyVldFun, valVldFun } = constraints[0];

      if ((!kT && !keyVldFun) || (!vT && !valVldFun)) return false;

      return (
         IsObject(value) &&
         Object.entries(value).every(([k, v]: any) => {
            return (
               (keyVldFun ? keyVldFun(k) : this.validateType(k, kT ?? EType.String, false)) &&
               (valVldFun ? valVldFun(v) : vT ? this.validateType(v, vT, isArray) : true)
            );
         })
      );
   }

   defaultMessage({ constraints }: ValidationArguments): string {
      return `The value must be a number string with length ${constraints[0] ?? 6}`;
   }
}

export function IsRecord<K extends EType.String | EType.Number, T extends EType>(
   constraints?: IsRecordConstraintType<K, T>,
) {
   return function ({ constructor }: any, propertyName: string) {
      registerDecorator({
         target: constructor,
         propertyName,
         constraints: [constraints],
         validator: IsRecordConstraint,
      });
   };
}
