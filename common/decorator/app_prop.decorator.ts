import { Prop, PropOptions } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import {
   IsBoolean,
   IsDateString,
   IsEnum,
   IsMongoId,
   IsNumber,
   IsOptional,
   IsString,
   Matches,
   ValidateNested,
} from 'class-validator';
import { regex } from '@common/utils/regex';
import { Type } from 'class-transformer';

type Options = {
   validators?: Array<{ func: any; args?: Array<any> }>;
   userName?: boolean;
   validateString?: boolean;
   validateEnum?: boolean;
   prop?: boolean;
   swagger?: Omit<ApiPropertyOptions, 'type'>;
   type?: any;
};

export default function AppProp(
   propOptions?: PropOptions,
   options?: Options | (Options & { nested: any }),
) {
   return function (target: any, key: string) {
      const {
         validateString = true,
         validateEnum = true,
         prop = true,
         userName = false,
         swagger,
         validators,
      } = options ?? {};

      const pOpt = {
         unique: userName,
         ...((propOptions as any) ?? {}),
         required: (propOptions as any)?.required ?? true,
      };

      const isArray = Array.isArray(pOpt.type);

      if (prop) Prop(pOpt)(target, key);
      ApiProperty({
         // type: pOpt.type, // NOTE: trigger circular dependency issue
         enum: pOpt.enum as any,
         example: pOpt.enum ? Object.keys(pOpt.enum)[0] : userName ? 'easUser11' : undefined,
         description: userName ? 'Unique username with contain letters & numbers only' : undefined,
         ...swagger,
      } as any)(target, key);

      if (
         pOpt.type.name === 'SchemaMixed' ||
         (Array.isArray(pOpt.type) && pOpt.type[0].type?.name === 'SchemaMixed')
      ) {
         ValidateNested({ each: Array.isArray(pOpt.type) ? true : undefined })(target, key);
         if (options?.type) Type(() => options.type)(target, key);
      }
      if (!pOpt.required) IsOptional()(target, key);
      if (pOpt.enum && validateEnum) IsEnum(pOpt.enum as any)(target, key);

      const valOpt = { each: isArray ? true : undefined };
      switch (isArray ? pOpt.type[0].name : pOpt.type.name) {
         case 'String':
            if (validateString && !pOpt.enum) IsString(valOpt)(target, key);
            break;

         case 'Number':
            IsNumber(undefined, valOpt)(target, key);
            break;

         case 'Boolean':
            IsBoolean(valOpt)(target, key);
            break;

         case 'Date':
            IsDateString(undefined, valOpt)(target, key);
            break;

         case 'SchemaObjectId':
            IsMongoId(valOpt)(target, key);
            break;

         default:
            break;
      }

      if (userName) Matches(regex.userName)(target, key);
      if (validators) validators.forEach(({ func, args }) => func(...(args ?? []))(target, key));
   };
}
